Drop Table IF EXISTS DataModel;
Drop Table IF EXISTS Field;
Drop Table IF EXISTS DataModel_Field;


Create Table  IF NOT EXISTS  DataModel (
	id INTEGER primary key,
	name text UNIQUE
);
Create Table IF NOT EXISTS Field(
	id INTEGER primary key,
	name text UNIQUE
);


Create Table IF NOT EXISTS DataModel_Field(
	datamodel number,
	field number,
	primary key(datamodel,field),
	FOREIGN KEY(datamodel) REFERENCES DataModel(id),
	FOREIGN KEY(field) REFERENCES Field(id)
);

insert into DataModel values(1,'aaa');
insert into DataModel values(2,'bbb');
	
insert into Field values(1,'f1');
insert into Field values(2,'f2');
insert into Field values(null,'f3');

insert into DataModel_Field values(1,1);
insert into DataModel_Field values(1,2);

insert into DataModel_Field values(2,2);
