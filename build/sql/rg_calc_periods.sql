-- Table: public.rg_calc_periods

-- DROP TABLE public.rg_calc_periods;

CREATE TABLE public.rg_calc_periods
(
    reg_type reg_types NOT NULL,
    date_time timestamp without time zone NOT NULL,
    CONSTRAINT rg_calc_periods_pkey PRIMARY KEY (reg_type)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.rg_calc_periods
    OWNER TO ;

