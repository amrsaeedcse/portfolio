library ieee;
use ieee.std_logic_1164.all;

Entity Generic_Mem_Data_Register is
	generic(
		n:integer:=32
	);
	port(
		d:in std_logic_vector(n-1 downto 0);
		q:out std_logic_vector(n-1 downto 0);
		clk:in std_logic;
		rst:in std_logic
	);
end Entity ;

architecture bh_Generic_Mem_Data_Register of Generic_Mem_Data_Register is
signal q_sig :std_logic_vector(n-1 downto 0);
begin
	q<=q_sig;
	process(clk,rst)
	begin
		if(rst='1')
			then
		q_sig<=(others=>'0');
		elsif(rising_edge(clk))
			then
			q_sig<=d;	
		end if;	
	end process;
end architecture ;