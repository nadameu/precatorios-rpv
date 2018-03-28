import PaginaListar from './PaginaListar';
import PaginaProcesso from './PaginaProcesso';
import PaginaRequisicao from './PaginaRequisicao';

const classesPorAcao: { [acao: string]: PaginaComAlteracoesConstructor } = {
	processo_selecionar: PaginaProcesso,
	processo_precatorio_rpv: PaginaListar,
	oficio_requisitorio_visualizar: PaginaRequisicao,
};

const paginas: WeakMap<Document, PaginaComAlteracoes> = new WeakMap();

export default {
	analisar(doc: Document) {
		if (paginas.has(doc)) {
			return paginas.get(doc);
		}

		let classe: PaginaComAlteracoesConstructor | null = null;

		const url = new URL(doc.location.href);
		const acao = url.searchParams.get('acao');

		if (doc.domain.match(/^eproc\.(trf4|jf(pr|rs|sc))\.jus\.br$/)) {
			if (acao && acao in classesPorAcao) classe = classesPorAcao[acao];
		}

		if (classe !== null) {
			const pagina = new classe(doc);
			paginas.set(doc, pagina);
			return pagina;
		}
	},
};
