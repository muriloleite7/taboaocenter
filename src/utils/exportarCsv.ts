export function exportarParaCSV(data: any[], colunas: { chave: string; label: string }[], nomeArquivo: string) {
  if (!data || data.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }

  // 1. Cria o cabeçalho usando os labels amigáveis
  const cabecalho = colunas.map(col => `"${col.label}"`).join(";");

  // 2. Cria as linhas de dados
  const linhas = data.map(item => {
    return colunas.map(col => {
      let valor = item[col.chave];
      
      // Trata valores nulos ou indefinidos
      if (valor === null || valor === undefined) valor = "";
      
      // Se for número, transforma para o formato brasileiro (com vírgula se tiver decimais)
      if (typeof valor === "number") {
        valor = valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      // Escapa aspas duplas internas para não quebrar o CSV
      const valorFormatado = String(valor).replace(/"/g, '""');
      
      return `"${valorFormatado}"`;
    }).join(";");
  });

  // 3. Junta tudo com quebra de linha
  const conteudoCSV = [cabecalho, ...linhas].join("\n");

  // 4. Adiciona o BOM (\uFEFF) para o Excel reconhecer caracteres especiais/acentos em UTF-8
  const blob = new Blob(["\uFEFF" + conteudoCSV], { type: "text/csv;charset=utf-8;" });
  
  // 5. Cria o link invisível e dispara o download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}