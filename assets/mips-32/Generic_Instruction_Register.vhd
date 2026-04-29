library ieee;
use ieee.std_logic_1164.all;

Entity Generic_Instruction_Register is
	generic(
		n:integer:=32
	);
	port(
		instruction_in:in std_logic_vector(n-1 downto 0);
		instruction_out:out std_logic_vector(n-1 downto 0);
		clk,rst,irwrite:in std_logic
	);
end Entity ;

architecture bh_Generic_Instruction_Register of Generic_Instruction_Register is
signal instruction_out_sig :std_logic_vector(n-1 downto 0);
begin
	instruction_out<=instruction_out_sig;
	process(clk,rst)
	begin
		if(rst='1')
			then
		instruction_out_sig<=(others=>'0');
		elsif(rising_edge(clk)and irwrite='1')
			then
		instruction_out_sig<=instruction_in;	
		end if;	
	end process;
end architecture ;