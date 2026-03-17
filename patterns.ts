// 1. ПАТЕРН "БУДІВЕЛЬНИК" (Builder)
// Вирішує проблему складного створення об'єкта "Витрата" з багатьма необов'язковими полями.

class Expense {
    id: string;
    title: string;
    amount: number;
    payerId: string;
    category: string;
    locationMapUrl: string | null;

    constructor(builder: ExpenseBuilder) {
        this.id = builder.id;
        this.title = builder.title;
        this.amount = builder.amount;
        this.payerId = builder.payerId;
        this.category = builder.category || 'Загальне';
        this.locationMapUrl = builder.locationMapUrl || null;
    }
}

class ExpenseBuilder {
    id: string;
    title: string;
    amount: number;
    payerId: string;
    category?: string;
    locationMapUrl?: string;

    constructor(id: string, title: string, amount: number, payerId: string) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.payerId = payerId;
    }

    setCategory(category: string): ExpenseBuilder {
        this.category = category;
        return this;
    }

    setLocation(url: string): ExpenseBuilder {
        this.locationMapUrl = url;
        return this;
    }

    build(): Expense {
        return new Expense(this);
    }
}

// 2. ПАТЕРН "СТРАТЕГІЯ" (Strategy)
// Вирішує проблему жорстко закодованих алгоритмів розподілу суми чека.

interface SplitStrategy {
    calculate(amount: number, participants: string[]): { user: string, debt: number }[];
}

// Стратегія 1: Порівну
class EqualSplitStrategy implements SplitStrategy {
    calculate(amount: number, participants: string[]) {
        const share = Math.round((amount / participants.length) * 100) / 100;
        return participants.map(p => ({ user: p, debt: share }));
    }
}

// Стратегія 2: За відсотками
class PercentageSplitStrategy implements SplitStrategy {
    constructor(private percentages: number[]) {}

    calculate(amount: number, participants: string[]) {
        // --- ПОКРАЩЕННЯ ДЛЯ ЛАБ №8 ---
        // Додаємо валідацію: перевіряємо, чи сума всіх часток дорівнює 100%.
        // Це гарантує, що вся сума чека буде розподілена коректно.
        const totalPercentage = this.percentages.reduce((sum, p) => sum + p, 0);
        if (totalPercentage !== 100) {
            throw new Error("Помилка валідації: Сума відсотків повинна дорівнювати 100%");
        }
        // -----------------------------

        return participants.map((p, index) => ({
            user: p,
            debt: Math.round(amount * (this.percentages[index]! / 100))
        }));
    }
}

class ExpenseContext {
    private strategy: SplitStrategy;

    constructor(strategy: SplitStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: SplitStrategy) {
        this.strategy = strategy;
    }

    executeSplit(amount: number, participants: string[]) {
        return this.strategy.calculate(amount, participants);
    }
}

// 3. ПАТЕРН "ФАСАД" (Facade)
// Приховує складність взаємодії між репозиторієм, калькулятором та системою сповіщень.

class ExpenseRepository {
    save(expense: Expense) { console.log(`[БД] Витрату "${expense.title}" збережено.`); }
}
class BalanceCalculator {
    recalculate(groupId: string) { console.log(`[Баланс] Перераховано борги для групи ${groupId}.`); }
}
class NotificationService {
    sendPush(groupId: string, msg: string) { console.log(`[Push] Сповіщення групі ${groupId}: ${msg}`); }
}

class ExpenseFacade {
    private repo = new ExpenseRepository();
    private calc = new BalanceCalculator();
    private notifier = new NotificationService();

    processNewExpense(expense: Expense, groupId: string) {
        this.repo.save(expense);
        this.calc.recalculate(groupId);
        this.notifier.sendPush(groupId, `Додано нову витрату на ${expense.amount} грн!`);
    }
}

// --- ТЕСТУВАННЯ ВСІХ ПАТЕРНІВ ДЛЯ ЗВІТУ ---
console.log("=== ТЕСТУВАННЯ ПАТЕРНІВ ПРОЄКТУ FAIRSHARE ===");

// 1. Тест Будівельника
console.log("\n--- 1. Тест Builder ---");
const myExpense = new ExpenseBuilder("exp_001", "Вечеря в ресторані", 1500, "user_Anna")
    .setCategory("Їжа")
    .setLocation("Вул. Незалежності, 15")
    .build();
console.log("Створено об'єкт витрати:", myExpense.title, "| Категорія:", myExpense.category);

// 2. Тест Стратегії
console.log("\n--- 2. Тест Strategy ---");
const participants = ["Анна", "Олег", "Марія"];

const context = new ExpenseContext(new EqualSplitStrategy());
console.log("Розподіл ПОРІВНУ:");
console.log(context.executeSplit(myExpense.amount, participants));

// Тестування з коректними відсотками
context.setStrategy(new PercentageSplitStrategy([50, 25, 25]));
console.log("Розподіл ЗА ВІДСОТКАМИ (50%, 25%, 25%):");
console.log(context.executeSplit(myExpense.amount, participants));

// 3. Тест Фасаду
console.log("\n--- 3. Тест Facade ---");
const facade = new ExpenseFacade();
facade.processNewExpense(myExpense, "group_Bali_2026");

console.log("\n=== ТЕСТУВАННЯ ЗАВЕРШЕНО ===");