library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity Memory is	
  port( -- inputs
        CLK,rst   : in std_logic;
        address   : in std_logic_vector(31 downto 0);
        MemWrite  : in std_logic;
        MemRead   : in std_logic;
        WriteData : in std_logic_vector(31 downto 0);

        -- output
        MemData   : out std_logic_vector(31 downto 0) );
end Memory;

architecture bh_Memory of Memory is
  	type mem_type is array (0 to 63) of std_logic_vector(7 downto 0);
signal mem: mem_type := (
	-- auto generated
	-- lw $R0,47($R20)
	0 => "10001110",
	1 => "10000000",
	2 => "00000000",
	3 => "00101111",
	
	-- addi $R1,$R3,50
	4 => "00100000",
	5 => "01100001",
	6 => "00000000",
	7 => "00110010",
	
	-- addi $R2,$R3,48
	8 => "00100000",
	9 => "01100010",
	10 => "00000000",
	11 => "00110000",
	
	-- add $R2,$R2,$R0
	12 => "00000000",
	13 => "01000000",
	14 => "00010000",
	15 => "00100000",
	
	-- beq $R1,$R2,0
	16 => "00010000",
	17 => "00100010",
	18 => "00000000",
	19 => "00000000",
	
	-- j 3
	20 => "00001000",
	21 => "00000000",
	22 => "00000000",
	23 => "00000011",
	
	-- add $R0,$R1,$R2
	24 => "00000000",
	25 => "00100010",
	26 => "00000000",
	27 => "00100000",
	
	-- lw $R10,47($R20)
	28 => "10001110",
	29 => "10001010",
	30 => "00000000",
	31 => "00101111",
	
	50 => "00000010",
	
	others => "00000000" );

begin

  process(CLK, rst)
  begin
    if rising_edge(CLK) and MemWrite = '1' then
      mem(to_integer(unsigned(address)))     <= WriteData(31 downto 24);
      mem(to_integer(unsigned(address) + 1)) <= WriteData(23 downto 16);
      mem(to_integer(unsigned(address) + 2)) <= WriteData(15 downto 8);
      mem(to_integer(unsigned(address) + 3)) <= WriteData(7  downto 0);
    end if;
  end process;

  MemData <= mem(to_integer(unsigned(address)))     &
             mem(to_integer(unsigned(address) + 1)) &
             mem(to_integer(unsigned(address) + 2)) &
             mem(to_integer(unsigned(address) + 3)) when MemRead = '1'else (others => '0');

end bh_Memory;