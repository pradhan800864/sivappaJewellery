create table users (
	userID SERIAL PRIMARY KEY,
	username varchar (255),
	firstName varchar (255),
	lastName varchar (255),
	emailid varchar (255),
	password varchar (255),
	referrealcode varchar (11),
	wallet INTEGER DEFAULT 0
);

CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Levels (
    level VARCHAR(10) PRIMARY KEY, -- Column for levels (level1, level2, ...)
    value DECIMAL(5, 2) NOT NULL   -- Column for percentage values (0 to 100)
);

CREATE TABLE discounts (
    id SERIAL PRIMARY KEY,
    discount_code VARCHAR(12) NOT NULL,
    discount_value DECIMAL(5, 2) NOT NULL,
    applicable_products TEXT[], -- Store as array of product names
    minimum_requirement VARCHAR(50) NOT NULL,
    minimum_value DECIMAL(10, 2),
    eligibility VARCHAR(50) NOT NULL,
    specific_customers TEXT[], -- Store as array of usernames
    active_start_date TIMESTAMP NOT NULL,
    active_end_date TIMESTAMP
);

select * from levels l ;

select * from admin;

select * from users;

select * from discounts d ;

select firstname, referralcode from users where username = 'Pradhana800864'

-- delete from users


-- Store details table (consist of store, owner & bank details)

-- Create a sequence (ST-0001 to ST-9999) for the custom store_id 

CREATE SEQUENCE store_id_seq START 1 INCREMENT 1;

CREATE TABLE stores (
    store_id VARCHAR(10) PRIMARY KEY DEFAULT 'ST-' || LPAD(nextval('store_id_seq')::TEXT, 4, '0'),
    store_name VARCHAR(100) NOT NULL,
    owner_name1 VARCHAR(100) NOT NULL,
    contact_number1 VARCHAR(10),
    email_id1 VARCHAR(100),
    owner_name2 VARCHAR(100) NOT NULL,
    contact_number2 VARCHAR(10),
    email_id2 VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(20),
    ifsc_code VARCHAR(11),
    GST_NO VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE stores ALTER COLUMN owner_name2 DROP NOT NULL;


select * from pocproject.public.stores;

insert into  pocproject.public.stores (store_name, owner_name1, contact_number1, email_id1,owner_name2, address,city, state, postal_code, bank_name, bank_account_number, ifsc_code, GST_NO)
values ('abcjewellary','sivappa k','987654321','sivappa@gmail.com','xyz','kallururoad','kurnool','kurnool','560016','SBI','000000000012345','SBI0000001','GST0987');

	
insert into  pocproject.public.stores (store_name, owner_name1, contact_number1, email_id1, address,city, state, postal_code, bank_name, bank_account_number, ifsc_code, GST_NO)
values ('abcjewellary','sivappa k','987654321','sivappa@gmail.com','kallururoad','kurnool','kurnool','560016','SBI','000000000012345','SBI0000001','GST0987'),
('sivappajewellary','pavan k','987654322','sivappa@gmail.com','kallururoad','kurnool','kurnool','560016','SBI','00000000001235','SBI000001','GST0980');
	

-- deleting rows in table & resetting store_id
truncate table stores;
ALTER SEQUENCE store_id_seq RESTART WITH 1;

	
CREATE TABLE referrals (
parentcode VARCHAR(255) NOT NULL,
childcode VARCHAR(255) NOT NULL);

	
SELECT * FROM referrals

delete from referrals where childcode='ITW-74H-CYE'

delete from users where userid='19'

SELECT COUNT(*) AS childcount FROM referrals WHERE parentcode = 'VTF-7O5-PQJ'

SELECT referralcode from users where username='Company'
	
	
SELECT parentcode FROM referrals WHERE childcode = 'M3A-LZ4-H65'

SELECT childcode FROM referrals WHERE parentcode = 'M3A-LZ4-H65'

UPDATE users SET wallet = 0;
	
ALTER TABLE users ADD COLUMN wallet INTEGER DEFAULT 0;


INSERT INTO Levels (level, value)
VALUES 
    ('level1', 10.00),
    ('level2', 10.00),
    ('level3', 10.00),
    ('level4', 10.00),
    ('level5', 10.00),
    ('level6', 10.00),
    ('level7', 10.00),
    ('level8', 10.00),
    ('level9', 10.00),
    ('level10', 10.00);

   
SELECT * 
FROM Levels
ORDER BY CAST(SUBSTRING(level FROM 6) AS INT);

SELECT * FROM admin WHERE username = 'admin'
	
		
	
	
	

