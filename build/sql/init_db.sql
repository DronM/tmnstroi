-- initial scripts

INSERT INTO time_zone_locales (descr,name,hour_dif) VALUES('Азия/Екатеринбург', 'Asia/Yekaterinburg', 5);

INSERT INTO users
(name, role_id, email, pwd, time_zone_locale_id, locale_id)
VALUES
('admin','admin','katrenplus@mail.ru',md5('123456'),1,'ru');

