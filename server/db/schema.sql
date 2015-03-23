drop table if exists feeds;
create table feeds (
       id integer primary key autoincrement,
       title text not null
);

drop table if exists entries;
create table entries (
       id integer primary key autoincrement,
       feed_id integer,
       title text not null,
       text text not null,
       foreign key(feed_id) references feeds(id)
);
