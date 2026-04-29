library ieee;
use ieee.std_logic_1164.all;

package Components is
component Register_File is
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
end component;

component Generic_pc is
    generic (
        address_width : integer := 32
    );
    port (
        clk         : in  std_logic;
        rst         : in  std_logic;
        pccontrol   : in  std_logic;
        next_pc     : in  std_logic_vector(address_width-1 downto 0);
        pc_out      : out std_logic_vector(address_width-1 downto 0)
    );
end component;

component Generic_ALU is
    generic (
        n : integer := 32
    );
    port (
        a            : in  std_logic_vector(n-1 downto 0);
        b            : in  std_logic_vector(n-1 downto 0);
        result       : out std_logic_vector(n-1 downto 0);
        alu_control  : in  std_logic_vector(3 downto 0);
        zero         : out std_logic
    );
end component;

component ALU_Control is
    port (
        alu_op      : in  std_logic_vector(1 downto 0);
        funct       : in  std_logic_vector(5 downto 0);
        alu_control : out std_logic_vector(3 downto 0)
    );
end component;

component ControlUnit is
    port (
        -- input
        CLK         : in std_logic;
        rst       : in std_logic;
        Op          : in std_logic_vector(5 downto 0);

        -- output (control signals)
        PCWriteCond : out std_logic;
        PCWrite     : out std_logic;
        IorD        : out std_logic;
        MemRead     : out std_logic;
        MemWrite    : out std_logic;
        MemToReg    : out std_logic;
        IRWrite     : out std_logic;
        PCSource    : out std_logic_vector(1 downto 0);
        ALUOp       : out std_logic_vector(1 downto 0);
        ALUSrcB     : out std_logic_vector(1 downto 0);
        ALUSrcA     : out std_logic;
        RegWrite    : out std_logic;
        RegDst      : out std_logic
    );
end component;

component Generic_Mem_Data_Register is
    generic(
        n : integer := 32
    );
    port(
        d   : in  std_logic_vector(n-1 downto 0);
        q   : out std_logic_vector(n-1 downto 0);
        clk : in  std_logic;
        rst : in  std_logic
    );
end component;

component Generic_2_1_Mux is
    generic(
        data_bits : integer := 32
    );
    port(
        a      : in  std_logic_vector(data_bits-1 downto 0);
        b      : in  std_logic_vector(data_bits-1 downto 0);
        sel    : in  std_logic;
        result : out std_logic_vector(data_bits-1 downto 0)
    );
end component;

component Generic_3_1_Mux is
    generic(
      data_bits : integer := 32
    );
    port(
      a, b, c  : in  std_logic_vector(data_bits-1 downto 0);
      sel      : in  std_logic_vector(1 downto 0);
      result   : out std_logic_vector(data_bits-1 downto 0)
    );
end component;

component Generic_4_1_Mux is
    generic(
      data_bits : integer := 32
    );
    port(
      a, b, c, d : in  std_logic_vector(data_bits-1 downto 0);
      sel        : in  std_logic_vector(1 downto 0);
      result     : out std_logic_vector(data_bits-1 downto 0)
    );
end component;

component Generic_Instruction_Register is
    generic(
      n : integer := 32
    );
    port(
      instruction_in  : in  std_logic_vector(n-1 downto 0);
      instruction_out : out std_logic_vector(n-1 downto 0);
      clk             : in  std_logic;
      rst             : in  std_logic;
      irwrite         : in  std_logic
    );
end component;

component Generic_Temp_Registers is
    generic(
      data_bits : integer := 32
    );
    port(
      CLK         : in std_logic;
      rst         : in std_logic;
      in_reg_a    : in std_logic_vector(data_bits-1 downto 0);
      in_reg_b    : in std_logic_vector(data_bits-1 downto 0);
      in_alu_out  : in std_logic_vector(data_bits-1 downto 0);
      out_reg_a   : out std_logic_vector(data_bits-1 downto 0);
      out_reg_b   : out std_logic_vector(data_bits-1 downto 0);
      out_alu_out : out std_logic_vector(data_bits-1 downto 0)
    );
end component;

component Memory is
    port(
      CLK       : in std_logic;
      rst       : in std_logic;
      address   : in std_logic_vector(31 downto 0);
      MemWrite  : in std_logic;
      MemRead   : in std_logic;
      WriteData : in std_logic_vector(31 downto 0);
      MemData   : out std_logic_vector(31 downto 0)
    );
end component;
end package;	