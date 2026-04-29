library ieee;
use ieee.std_logic_1164.all;
use work.components.all;

entity MIPS32 is
  port( CLK, rst : in std_logic );
end MIPS32;

architecture bh_MIPS32 of MIPS32 is

-- Constants
constant PC_increment : std_logic_vector(31 downto 0) := "00000000000000000000000000000100";

-- Signals
signal PC_out, MuxToAddress, MemDataOut, MemoryDataRegOut, InstructionRegOut : std_logic_vector(31 downto 0);
signal MuxToWriteData, ReadData1ToA, ReadData2ToB, RegAToMux, RegBOut : std_logic_vector(31 downto 0);
signal SignExtendOut, ShiftLeft1ToMux4, MuxToAlu, Mux4ToAlu, AluResultOut, AluOutToMux : std_logic_vector(31 downto 0);
signal JumpAddress, MuxToPC : std_logic_vector(31 downto 0);
signal ZeroCarry, ALUSrcA_TL, RegWrite_TL, RegDst_TL, PCWriteCond_TL, PCWrite_TL : std_logic;
signal IorD_TL, MemRead_TL, MemWrite_TL, MemToReg_TL, IRWrite_TL, ANDtoOR, ORtoPC : std_logic;
signal MuxToWriteRegister : std_logic_vector(4 downto 0);
signal ALUControltoALU : std_logic_vector(3 downto 0);
signal PCsource_TL, ALUSrcB_TL, ALUOp_TL : std_logic_vector(1 downto 0);

begin

-- Direct signal assignments for shift/extend operations
SignExtendOut(15 downto 0) <= InstructionRegOut(15 downto 0);
SignExtendOut(31 downto 16) <= (others => InstructionRegOut(15)); -- Sign extension

ShiftLeft1ToMux4 <= SignExtendOut(29 downto 0) & "00"; -- Shift left by 2

JumpAddress(27 downto 0) <= InstructionRegOut(25 downto 0) & "00"; -- Shift left by 2
JumpAddress(31 downto 28) <= PC_out(31 downto 28);

-- Control logic
ANDtoOR <= ZeroCarry and PCWriteCond_TL;
ORtoPC <= ANDtoOR or PCWrite_TL;
								  	
-- Port mappings


ALU_inst : Generic_ALU
    generic map (
        n => 32
    )
    port map (
        a           => MuxToAlu,
        b           => Mux4ToAlu,
        result      => AluResultOut,
        alu_control => ALUControltoALU,
        zero        => ZeroCarry
    );


ALU_Control_inst : ALU_Control
    port map (
        alu_op      => ALUOp_TL,
        funct       => InstructionRegOut(5 downto 0),
        alu_control => ALUControltoALU
    );
  

Control_Unit_inst : ControlUnit
    port map (
        CLK         => CLK,
        rst       => rst,
        Op          => InstructionRegOut(31 downto 26),
        PCWriteCond => PCWriteCond_TL,
        PCWrite     => PCWrite_TL,
        IorD        => IorD_TL,
        MemRead     => MemRead_TL,
        MemWrite    => MemWrite_TL,
        MemToReg    => MemToReg_TL,
        IRWrite     => IRWrite_TL,
        PCSource    => PCsource_TL,
        ALUOp       => ALUOp_TL,
        ALUSrcB     => ALUSrcB_TL,
        ALUSrcA     => ALUSrcA_TL,
        RegWrite    => RegWrite_TL,
        RegDst      => RegDst_TL
    );


Instruction_Reg_inst : Generic_Instruction_Register
    generic map (
        n => 32
    )
    port map (
        instruction_in  => MemDataOut,
        instruction_out => InstructionRegOut,
        clk             => CLK,
        rst             => rst,
        irwrite         => IRWrite_TL
    );


Memory_inst : Memory
    port map (
        CLK       => CLK,
        rst       => rst,
        address   => MuxToAddress,
        MemWrite  => MemWrite_TL,
        MemRead   => MemRead_TL,
        WriteData => RegBOut,
        MemData   => MemDataOut
    );


Mem_Data_Reg_inst : Generic_Mem_Data_Register
    generic map (
        n => 32
    )
    port map (
        d   => MemDataOut,
        q   => MemoryDataRegOut,
        clk => CLK,
        rst => rst
    );
 

Mux_Address_inst : Generic_2_1_Mux
    generic map (
        data_bits => 32
    )
    port map (
        a      => PC_out,
        b      => AluOutToMux,
        sel    => IorD_TL,
        result => MuxToAddress
    );
 

Mux_Write_Reg_Dst_inst : Generic_2_1_Mux
    generic map (
        data_bits => 5
    )
    port map (
        a      => InstructionRegOut(20 downto 16),
        b      => InstructionRegOut(15 downto 11),
        sel    => RegDst_TL,
        result => MuxToWriteRegister
    );


Mux_Write_Data_inst : Generic_2_1_Mux
    generic map (
        data_bits => 32
    )
    port map (
        a      => AluOutToMux,
        b      => MemoryDataRegOut,
        sel    => MemToReg_TL,
        result => MuxToWriteData
    );

Mux_ALU_A_inst : Generic_2_1_Mux
    generic map (
        data_bits => 32
    )
    port map (
        a      => PC_out,
        b      => RegAToMux,
        sel    => ALUSrcA_TL,
        result => MuxToAlu
    );


Mux_ALU_B_inst : Generic_4_1_Mux
    generic map (
        data_bits => 32
    )
    port map (
        a      => RegBOut,
        b      => PC_increment,
        c      => SignExtendOut,
        d      => ShiftLeft1ToMux4,
        sel    => ALUSrcB_TL,
        result => Mux4ToAlu
    );
	

Mux_PC_inst : Generic_3_1_Mux
    generic map (
        data_bits => 32
    )
    port map (
        a      => AluResultOut,
        b      => AluOutToMux,--branching
        c      => JumpAddress,
        sel    => PCsource_TL,
        result => MuxToPC
    );


PC_inst : Generic_pc
    generic map (
        address_width => 32
    )
    port map (
        clk       => CLK,
        rst       => rst,
        pccontrol => ORtoPC,
        next_pc   => MuxToPC,
        pc_out    => PC_out
    );

	
Register_File_inst : Register_File
    generic map (
        data_bits    => 32
    )
    port map (
        read_reg1  => InstructionRegOut(25 downto 21),
        read_reg2  => InstructionRegOut(20 downto 16),
        write_reg  => MuxToWriteRegister,
        write_data => MuxToWriteData,
        reg_write  => RegWrite_TL,
        clk        => CLK,
        rst        => rst,
        read_data1 => ReadData1ToA,
        read_data2 => ReadData2ToB
    );
 

Temp_Registers_inst : Generic_Temp_Registers
    generic map (
        data_bits => 32
    )
    port map (
        CLK         => CLK,
        rst         => rst,
        in_reg_a    => ReadData1ToA,
        in_reg_b    => ReadData2ToB,
        in_alu_out  => AluResultOut,
        out_reg_a   => RegAToMux,
        out_reg_b   => RegBOut,
        out_alu_out => AluOutToMux
    );

end bh_MIPS32;