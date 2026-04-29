library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity Register_File is
    generic (
        data_bits    : integer := 32
    );
    port (
        read_reg1  : in  std_logic_vector(4 downto 0);
        read_reg2  : in  std_logic_vector(4 downto 0);
        write_reg  : in  std_logic_vector(4 downto 0);
        write_data : in  std_logic_vector(data_bits-1 downto 0);
        reg_write  : in  std_logic;
        clk        : in  std_logic;
        rst        : in  std_logic;
        read_data1 : out std_logic_vector(data_bits-1 downto 0);
        read_data2 : out std_logic_vector(data_bits-1 downto 0)
    );
end entity;

architecture Bh_Register_File of Register_File is

    -- Array of registers
    type reg_array is array (0 to 2**5 - 1) of std_logic_vector(data_bits-1 downto 0);
    signal regs : reg_array := (others => (others => '0'));

begin

    -- Synchronous write & reset
    write_proc: process(clk, rst)
    begin
        if rst = '1' then
            -- Reset all registers to zero
            for i in regs'range loop
                regs(i) <= (others => '0');
            end loop;
        elsif rising_edge(clk) then
            if reg_write = '1' then
                regs(to_integer(unsigned(write_reg))) <= write_data;
            end if;
        end if;
    end process;

    read_proc: process(read_reg1, read_reg2, reg_write, write_reg, write_data, regs)
    begin
        -- Default: read from the array
        read_data1 <= regs(to_integer(unsigned(read_reg1)));
        read_data2 <= regs(to_integer(unsigned(read_reg2)));
    end process;

end architecture;
