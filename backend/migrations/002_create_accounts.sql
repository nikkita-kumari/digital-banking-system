CREATE TABLE accounts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL,

    account_number TEXT NOT NULL UNIQUE,

    account_type TEXT NOT NULL DEFAULT 'SAVINGS',

    currency CHAR(3) NOT NULL DEFAULT 'INR',

    balance NUMERIC(20, 2) NOT NULL DEFAULT 0,

    status TEXT NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_accounts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);