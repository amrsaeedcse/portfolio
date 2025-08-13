library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity generic_4_1_Mux is
  generic(
    data_bits : integer := 32
  );
  port(
    a, b, c, d : in  std_logic_vector(data_bits-1 downto 0);
    sel        : in  std_logic_vector(1 downto 0);
    result     : out std_logic_vector(data_bits-1 downto 0)
  );
end entity;

architecture bh_generic_4_1_Mux of generic_4_1_Mux is
begin
  process(sel, a, b, c, d)
  begin
    case sel is
      when "00" => result <= a;
      when "01" => result <= b;
      when "10" => result <= c;
      when "11" => result <= d;
      when others => result <= a;  -- default
    end case;
  end process;
end architecture;
