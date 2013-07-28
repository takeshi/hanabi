
drop table IF exists Process;


Create Table  IF NOT EXISTS  DataModel (
	id INTEGER primary key,
	name text UNIQUE
);

Create Table IF NOT EXISTS Field(
	id INTEGER primary key,
	name text UNIQUE
);

Create Table IF NOT EXISTS System(
	name text primary key,
	desc text
);

Create Table IF NOT EXISTS SubSystem(
	name text,
	desc text,
	system text,
	seq number,
	primary key (name,system),
	FOREIGN KEY(system) REFERENCES System(name) ON DELETE CASCADE ON UPDATE CASCADE
);

Create Table IF NOT EXISTS ConceptModel(
	name text,
	type text,
	subsystem text,
	system text,
	primary key(name,subsystem,system),
	FOREIGN KEY(system) REFERENCES System(name) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(subsystem) REFERENCES SubSystem(name) ON DELETE CASCADE ON UPDATE CASCADE

);

Create Table IF NOT EXISTS ConceptDataFlow(
	id number primary key,
	input text,
	output text,
	FOREIGN KEY(input) REFERENCES ConceptDataFlow(name) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(output) REFERENCES ConceptDataFlow(name) ON DELETE CASCADE ON UPDATE CASCADE
);

Create Table IF NOT EXISTS Role(
	name text primary key
);

Create Table IF NOT EXISTS Process(
	name text,
	system text,
	subsystem text,
	primary key(name,system,subsystem),
	FOREIGN KEY (system) REFERENCES System(name) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (subsystem) REFERENCES SubSystem(name) ON DELETE CASCADE ON UPDATE CASCADE
);

drop table IF EXISTS Activity;

Create Table IF NOT EXISTS Activity(
	name text,
	process text,
	subsystem text,
	system text,
	primary key (name,process,subsystem,system),
	FOREIGN KEY(process) REFERENCES Process(name) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(subsystem) REFERENCES Subsystem(name) ON DELETE CASCADE ON UPDATE CASCADE,	
	FOREIGN KEY(system) REFERENCES System(name) ON DELETE CASCADE ON UPDATE CASCADE
);

Create Table IF NOT EXISTS RoleActivity(
	id number primary key,
	role text,
	activity text,
	FOREIGN KEY(role) REFERENCES Role(name) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(activity) REFERENCES Activity(name) ON DELETE CASCADE ON UPDATE CASCADE
);

Create Table IF NOT EXISTS DataModel_Field(
	datamodel number,
	field number,
	primary key(datamodel,field),
	FOREIGN KEY(datamodel) REFERENCES DataModel(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(field) REFERENCES Field(id) ON DELETE CASCADE ON UPDATE CASCADE
);

delete from System;
insert into System values('Production',null);

delete from SubSystem;
insert into Subsystem(name,system) values('開発管理','Production');
insert into Subsystem(name,system) values('案件管理','Production');

delete from ConceptModel;
insert into ConceptModel(name,subsystem,system) values('案件','案件管理','Production');
insert into ConceptModel(name,subsystem,system) values('リソース','案件管理','Production');

delete from Process;
insert into Process(name,subsystem,system) values('提案','案件管理','Production');
insert into Process(name,subsystem,system) values('要件定義','案件管理','Production');
insert into Process(name,subsystem,system) values('設計','案件管理','Production');

delete from Activity;
insert into Activity(name,process,subsystem,system) values('見積','設計','案件管理','Production');
insert into Activity(name,process,subsystem,system) values('外部設計','設計','案件管理','Production');
insert into Activity(name,process,subsystem,system) values('サンプル','設計','案件管理','Production');


delete from Role;
insert into Role values('営業');
insert into Role values('導入');
insert into Role values('設計');
insert into Role values('製造');


delete from DataModel;
insert into DataModel values(1,'aaa');
insert into DataModel values(2,'bbb');
	
delete from Field;
insert into Field values(1,'f1');
insert into Field values(2,'f2');
insert into Field values(null,'f3');

delete from DataModel_Field;
insert into DataModel_Field values(1,1);
insert into DataModel_Field values(1,2);
insert into DataModel_Field values(2,2);
