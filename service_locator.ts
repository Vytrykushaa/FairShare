/** * 1. ENTITY (Моделі даних) */
interface Group {
    id: string;
    name: string;
    currency: string;
    members: string[]; 
}

/** * 2. REPOSITORY (Робота з даними) */
/** * Інтерфейс GroupRepository */
interface GroupRepository {
    getGroups(): Group[];
}

/** * Реалізація інтерфейсу GroupRepositoryImpl */
class GroupRepositoryImpl implements GroupRepository {
    getGroups(): Group[] {
        // Імітація отримання даних
        return [
            { id: "1", name: "Подорож на Балі", currency: "ГРН", members: ["user1", "user2"] },
            { id: "2", name: "Будинок на Балі", currency: "ГРН", members: ["user1", "user3"] }
        ];
    }
}

/** * 3. USE CASE (Бізнес-логіка) */
class GetGroupsUseCase {
    constructor(private groupRepository: GroupRepository) {}

    execute(): Group[] {
        return this.groupRepository.getGroups();
    }
}

/** * 4. SERVICE LOCATOR (Впровадження залежностей) */
class ServiceLocator {
    private static instance: ServiceLocator;
    private groupRepository: GroupRepository;

    private constructor() {
        // Ініціалізація конкретних реалізацій
        this.groupRepository = new GroupRepositoryImpl(); 
    }

    public static getInstance(): ServiceLocator {
        if (!ServiceLocator.instance) {
            ServiceLocator.instance = new ServiceLocator();
        }
        return ServiceLocator.instance;
    }

    /** * Метод для надання доступу до UseCase */
    public provideGetGroupsUseCase(): GetGroupsUseCase {
        return new GetGroupsUseCase(this.groupRepository); // 
    }
}

/** * 5. ПЕРЕВІРКА (Presenter/UI шар) */
// Отримання екземпляра локатора
const locator = ServiceLocator.getInstance();

// Впровадження UseCase через локатор
const getGroupsAction = locator.provideGetGroupsUseCase();

console.log("--- FairShare: Тестування Service Locator ---");

// Виконання дії та отримання списку (аналог оновлення UI)
const groups = getGroupsAction.execute();
groups.forEach(g => console.log(`Група: ${g.name} | ID: ${g.id}`));