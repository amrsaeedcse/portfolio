library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity ALU_Control is
    port(
        alu_op      : in  std_logic_vector(1 downto 0);
        funct       : in  std_logic_vector(5 downto 0);
        alu_control : out std_logic_vector(3 downto 0)
    );
end entity;

architecture bh_ALU_Control of ALU_Control is
begin
    process(alu_op, funct)
    begin
        case alu_op is
            when "00" => alu_control <= "0000"; -- Lw/Sw/Addi ->add
            when "01" => alu_control <= "0001"; -- Beq ->sub
            when "10" =>                        -- R-type ->use funct
                case funct is
                    when "100000" => alu_control <= "0000"; -- Add
                    when "100010" => alu_control <= "0001"; -- Sub
                    when "100100" => alu_control <= "0010"; -- And
                    when "100101" => alu_control <= "0011"; -- Or
                    when "101010" => alu_control <= "0100"; -- Slt
                    when "100110" => alu_control <= "0101"; -- Xor
                    when "100111" => alu_control <= "0110"; -- Xnor
                    when "000001" => alu_control <= "0111"; -- Sll
                    when "000010" => alu_control <= "1000"; -- Srl
                    when others    => alu_control <= "0000"; -- Default to add
                end case;
            when others =>
                alu_control <= "0000";
        end case;
    end process;
end architecture;
