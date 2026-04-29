library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

Entity Generic_pc is
	Generic(
		address_width:integer:=32
	);
	port(
		clk,rst,pccontrol:in std_logic;
		next_pc:in std_logic_vector(address_width-1 downto 0);
		pc_out:out std_logic_vector(address_width-1 downto 0)		
	);
end Entity;
architecture bh_Generic_pc of Generic_pc is
begin 
	process(clk,rst)
	begin
		if(rst='1')
			then
			pc_out<=(others=>'0');
		elsif(rising_edge(clk) and pccontrol='1')
			then
			pc_out<=next_pc;
		end if;	
	end process;	
end architecture ;