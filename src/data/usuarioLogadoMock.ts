export type CargoUsuario = "admin" | "funcionario";

export const usuarioLogadoMock = {
  id: "1",
  nome: "Administrador",
  cargo: "admin" as CargoUsuario,
};

// Para testar como funcionário, troque para:
// cargo: "funcionario" as CargoUsuario,

// export const usuarioLogadoMock = {
//  id: "1",
// nome: "Funcionário",
//  cargo: "funcionario" as CargoUsuario,
//};
