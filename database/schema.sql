drop table if exists feed;
create table feed (
       id integer primary key autoincrement,
       title text not null
);

drop table if exists entry;
create table entry (
       id integer primary key autoincrement,
       feed_id integer,
       title text not null,
       text text not null,
       foreign key(feed_id) references feed(id)
);
