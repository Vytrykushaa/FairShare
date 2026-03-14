/** * 1. ДОПОМІЖНІ КЛАСИ (Data Interfaces)
 * Описують структуру сутностей бізнес-логіки
 */
interface Group {
    id: string;
    name: string;
    currency: string;
    members: string[]; 
}

/** * 2. АРХІТЕКТУРНІ КЛАСИ (State Management)
 * Визначають стан програми згідно з підходом MVI
 */
interface FairShareState {
    isLoading: boolean;
    error: string | null;
    groups: Group[];
    totalBalance: number;
}

/** * 3. УТИЛІТНІ КЛАСИ (Utility)
 * Статичні методи для проведення розрахунків
 */
class FinanceCalculator {
    /**
     * Метод для рівномірного розподілу суми між учасниками.
     * Реалізує основну логіку MVP проекту.
     */
    static splitEqually(amount: number, participantsCount: number): number {
        if (participantsCount <= 0) return 0;
        // Заокруглення до 2 знаків після коми (копійки)
        return Math.round((amount / participantsCount) * 100) / 100;
    }
}

// --- Блок тестування для звіту (Console Output) ---
console.log("--- Тестування логіки FairShare ---");
const amount = 1200; 
const friends = 5;   
const result = FinanceCalculator.splitEqually(amount, friends);

console.log(`Загальна сума: ${amount} грн`);
console.log(`Кількість учасників: ${friends}`);
console.log(`Частка кожного: ${result} грн`);