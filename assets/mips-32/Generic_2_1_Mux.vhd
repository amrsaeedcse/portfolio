library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

Entity Generic_2_1_Mux is 
	Generic(
		data_bits:integer:=32
	);
	port(
	a,b : in std_logic_vector(data_bits-1 downto 0);
	sel:in std_logic;
	result:out std_logic_vector(data_bits-1 downto 0)
	);
end Entity;

architecture bh_Generic_2_1_Mux of Generic_2_1_Mux is 
begin
	with sel select
		result<=a when '0',
		b when '1',
		a when others;
end architecture;