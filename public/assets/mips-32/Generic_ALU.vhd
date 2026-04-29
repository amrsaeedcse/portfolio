library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;	  
Entity Generic_ALU is
	generic(
		n:integer:=32
	);
		port(
		a,b:in std_logic_vector(n-1 downto 0);
		result:out std_logic_vector(n-1 downto 0);
		alu_control :in std_logic_vector(3 downto 0);
		zero:out std_logic
	);
end entity;
	
architecture Bh_Generic_AlU of Generic_ALU is
signal result_signal : std_logic_vector(n-1 downto 0);
begin
	result<=result_signal;
	process(a,b,alu_control)
	begin
		case alu_control is	     
			when "0000" =>
				result_signal<=std_logic_vector(signed(a)+signed(b)); -- 0000 ->0 for add
			when "0001" =>
				result_signal<=std_logic_vector(signed(a)-signed(b)); -- 0001 ->1 for sub
			when "0010"	=>
				result_signal<=a and b ; --oo1o -> 2 for and
			when "0011"	=>
				result_signal <=a or b ; --0011 -> 3 for or
			when "0100"	=>
				result_signal<=(others=>'0');
				if(signed(a)<signed(b))
					then 
					result_signal(0)<='1';	--0100-> 4 for SLT(Set on Less Than) if b bigger than a result<=1
				end if;
			when "0101" =>
				result_signal<=a xor b; --0101 -> 5 for xor 
			when "0110"=>
				result_signal <=a xnor b;--0110 -> 6  for xnor
			when "0111"=>
				result_signal <= std_logic_vector(unsigned(b) sll 1);--0111 -> for sll b
			when "1000"=>
				result_signal <= std_logic_vector(unsigned(b) srl 1);--1000 -> for srl b
			when others =>
				result_signal<=(others=>'0'); --For another controls result<=0 
		end case;
		if result_signal = std_logic_vector(to_unsigned(0, result_signal'length))  --check again
			then
			zero<='0';
		else 
			zero<='1';
		end if;	
	end process;	
end architecture ;