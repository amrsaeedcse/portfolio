library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity Generic_Temp_Registers is
	generic(
		data_bits:integer:=32
	);
	port( -- input
		CLK         : in std_logic;
		rst  		: in std_logic;
		in_reg_a    : in std_logic_vector (data_bits-1 downto 0);
		in_reg_b    : in std_logic_vector (data_bits-1 downto 0);
		in_alu_out  : in std_logic_vector (data_bits-1 downto 0);
		
		-- output
		out_reg_a   : out std_logic_vector(data_bits-1 downto 0);
		out_reg_b   : out std_logic_vector(data_bits-1 downto 0);
		out_alu_out : out std_logic_vector(data_bits-1 downto 0) );
	end Generic_Temp_Registers;
	
architecture bh_Generic_Temp_Registers of Generic_Temp_Registers is
  type registers is array (0 to 2) of std_logic_vector(data_bits-1 downto 0);
  signal data : registers := ((others => (others => '0')));

begin
  process(CLK,rst)
  begin
    if rst = '1' then -- reset
      data <= ((others => (others => '0')));
    else if rising_edge(CLK) then
      data(0) <= in_reg_a;
      data(1) <= in_reg_b;
      data(2) <= in_alu_out;
    end if;
    end if;
  end process;

  out_reg_a   <= data(0);
  out_reg_b   <= data(1);
  out_alu_out <= data(2);

end bh_Generic_Temp_Registers;