import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "../style/editarInquilino.module.css";

export default function EditarContrato() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    inquilino: "",
    imovel: "",
    aluguel: "",
    vencimento: "",
    dataInicio: "",
    dataFim: "",
    aguaTipo: "variavel",
    luzTipo: "variavel",
    iptuTipo: "fixo"
  });

  useEffect(() => {
    // PREPARAÇÃO PARA DB: Busca os dados atuais do contrato
    setTimeout(() => {
      setFormData({
        inquilino: "João Silva",
        imovel: "Apto 101",
        aluguel: "1500",
        vencimento: "10",
        dataInicio: "2025-05-10",
        dataFim: "2026-05-10",
        aguaTipo: "fixo",
        luzTipo: "variavel",
        iptuTipo: "fixo"
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Alterações de contrato salvas:", formData);
    navigate(`/contratos/${id}`);
  };

  if (loading) return <div className={styles.containerEditar}><h1>Carregando contrato...</h1></div>;

  return (
    <div className={styles.containerEditar}>
      <div className={styles.headerEditar}>
        <div>
          <Link to={`/contratos/${id}`} className={styles.voltarLink}>← Voltar para detalhes</Link>
          <h1 className={styles.tituloEditar}>Editar Contrato #{id}</h1>
          <p className={styles.subtituloEditar}>Ajuste as condições vigentes deste contrato.</p>
        </div>
      </div>

      <form className={styles.formularioCard} onSubmit={handleSalvar}>
        <div className={styles.gridCampos}>
          <h2 className={styles.secaoTitulo}>Informações Principais</h2>
          
          <div className={`${styles.campoGrupo} ${styles.campoFull}`}>
            <label className={styles.labelForm}>Inquilino (Vínculo)</label>
            <input type="text" className={`${styles.inputForm} ${styles.inputBloqueado}`} value={formData.inquilino} disabled />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Valor do Aluguel</label>
            <input type="number" name="aluguel" className={styles.inputForm} value={formData.aluguel} onChange={handleChange} />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Dia do Vencimento</label>
            <input type="number" name="vencimento" className={styles.inputForm} value={formData.vencimento} onChange={handleChange} />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Início do Contrato</label>
            <input type="date" name="dataInicio" className={styles.inputForm} value={formData.dataInicio} onChange={handleChange} />
          </div>

          <div className={styles.campoGrupo}>
            <label className={styles.labelForm}>Fim do Contrato</label>
            <input type="date" name="dataFim" className={styles.inputForm} value={formData.dataFim} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.areaBotoes}>
          <button type="button" className={styles.botaoVoltar} onClick={() => navigate(-1)}>Cancelar</button>
          <button type="submit" className={styles.botaoSalvar}>Salvar Alterações</button>
        </div>
      </form>
    </div>
  );
}