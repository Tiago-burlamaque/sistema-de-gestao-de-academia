-- CreateEnum
CREATE TYPE "ObjetivoPaciente" AS ENUM ('EMAGRECIMENTO', 'HIPERTROFIA', 'SAUDE');

-- CreateEnum
CREATE TYPE "StatusPaciente" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusConsulta" AS ENUM ('AGENDADA', 'REALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoRefeicao" AS ENUM ('CAFE_DA_MANHA', 'ALMOCO', 'JANTAR', 'LANCHE');

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paciente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "peso_atual" DOUBLE PRECISION NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,
    "objetivo" "ObjetivoPaciente" NOT NULL,
    "observacao" TEXT,
    "status" "StatusPaciente" NOT NULL DEFAULT 'ATIVO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evolucao" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "percentual_gordura" DOUBLE PRECISION,
    "circunferencia_abdominal" DOUBLE PRECISION,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacao" TEXT,

    CONSTRAINT "evolucao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consulta" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "status" "StatusConsulta" NOT NULL DEFAULT 'AGENDADA',
    "observacao" TEXT,

    CONSTRAINT "consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plano_alimentar" (
    "id" SERIAL NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "nome_plano" TEXT NOT NULL,
    "calorias_diarias" INTEGER NOT NULL,
    "objetivo" TEXT NOT NULL,
    "observacao" TEXT,

    CONSTRAINT "plano_alimentar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refeicao" (
    "id" SERIAL NOT NULL,
    "plano_id" INTEGER NOT NULL,
    "tipo" "TipoRefeicao" NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "refeicao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_email_key" ON "paciente"("email");

-- AddForeignKey
ALTER TABLE "evolucao" ADD CONSTRAINT "evolucao_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consulta" ADD CONSTRAINT "consulta_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plano_alimentar" ADD CONSTRAINT "plano_alimentar_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "paciente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refeicao" ADD CONSTRAINT "refeicao_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "plano_alimentar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
