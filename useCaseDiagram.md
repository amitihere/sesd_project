flowchart LR

    %% Actors
    Employee([Employee])
    Manager([Manager])
    FinanceAdmin([Finance Admin])

    %% Employee Use Cases
    UC1((Create Expense))
    UC2((Submit Expense))
    UC3((View My Expenses))

    %% Manager Use Cases
    UC4((Approve Expense))
    UC5((Reject Expense))
    UC6((View All Expenses))

    %% Finance Admin Use Cases
    UC7((Approve Expense))
    UC8((Reject Expense))
    UC9((Mark Expense as Paid))
    UC10((View All Expenses))

    %% Common Use Cases
    UC11((View Audit Logs))

    %% Relationships
    Employee --> UC1
    Employee --> UC2
    Employee --> UC3

    Manager --> UC4
    Manager --> UC5
    Manager --> UC6

    FinanceAdmin --> UC7
    FinanceAdmin --> UC8
    FinanceAdmin --> UC9
    FinanceAdmin --> UC10

    %% Logs (accessible to all in current system)
    Employee --> UC11
    Manager --> UC11
    FinanceAdmin --> UC11