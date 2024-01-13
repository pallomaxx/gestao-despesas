
class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
	 
	  this.ano = ano;
	  this.mes = mes;
	  this.dia = dia;
	  this.tipo = tipo;
	  this.descricao = descricao;
	  this.valor = valor;
	}
  
	validarDados() {
	  for (let i in this) {
		if (this[i] == undefined || this[i] == "" || this[i] == null) {
		  return false;
		}
	  }
	  return true;
	}
  }
  
  class Bd {
	
	constructor() {
	  let id = localStorage.getItem("id");
  
	
	  if (id === null) {
		localStorage.setItem("id", 0);
	  }
	}
  
	getProximoId() {
	  let proximoId = localStorage.getItem("id");
	  return parseInt(proximoId) + 1;
	}
  
	gravar(d) {
	  let id = this.getProximoId();
  
	  d.id = id; // atribuindo o novo id à despesa
  
	  localStorage.setItem(id, JSON.stringify(d));

	  localStorage.setItem("id", id);
	}
  
	recuperarTodosRegistros() {

	//array de despesas
	  let despesas = Array();
  
	  let id = localStorage.getItem("id");
  
	//recuperar todas as despesas cadastradas em localStorage
	  for (let i = 1; i <= id; i++) {
		
		//recuperar a despesa
		let despesa = JSON.parse(localStorage.getItem(i));
  
		if (despesa === null) {
		  continue;
		}
  
		despesa.id = i; // atribuindo o id à despesa
  
		despesas.push(despesa);
	  }
  
	  return despesas;
	}
  
	pesquisar(despesa) {
	  console.log(despesa);
	}
  
	excluir(id) {
	  localStorage.removeItem(id);
	}
  }
  
  let bd = new Bd();
  
  // Inserção de dados
  function cadastrarDespesa() {
	let ano = document.getElementById("ano");
	let mes = document.getElementById("mes");
	let dia = document.getElementById("dia");
	let tipo = document.getElementById("tipo");
	let descricao = document.getElementById("descricao");
	let valor = document.getElementById("valor");
  
	let despesa = new Despesa(
	  ano.value,
	  mes.value,
	  dia.value,
	  tipo.value,
	  descricao.value,
	  valor.value
	);
  
	if (despesa.validarDados()) {
	  bd.gravar(despesa);
  
	  document.getElementById("modal_titulo").innerHTML =
		"Registro inserido com sucesso";
	  document.getElementById("modal_titulo_div").className =
		"modal-header text-success";
	  document.getElementById("modal_conteudo").innerHTML =
		"Despesa foi cadastrada com sucesso!";
	  document.getElementById("modal_btn").innerHTML = "Voltar";
	  document.getElementById("modal_btn").className = "btn btn-success";
  
	  $("#modalRegistraDespesa").modal("show");
  
	  ano.value = "";
	  mes.value = "";
	  dia.value = "";
	  tipo.value = "";
	  descricao.value = "";
	  valor.value = "";
  
	  carregaListaDespesas(); // atualizar a lista de despesas na interface

	} else {
	  document.getElementById("modal_titulo").innerHTML = "Erro na inclusão do registro";
	  document.getElementById("modal_titulo_div").className = "modal-header text-danger";
	  document.getElementById("modal_conteudo").innerHTML = "Erro na gravação, verifique se todos os campos foram preenchidos corretamente!";
	  document.getElementById("modal_btn").innerHTML = "Voltar e corrigir";
	  document.getElementById("modal_btn").className = "btn btn-danger";
		
	  //modal de erro
	  $("#modalRegistraDespesa").modal("show");
	}
  }

  function pesquisarDespesa() {
	console.log("Pesquisando despesa...");
	let ano = document.getElementById("ano").value;
	let mes = document.getElementById("mes").value;
	let dia = document.getElementById("dia").value;
	let tipo = document.getElementById("tipo").value;
	let descricao = document.getElementById("descricao").value;
	let valor = document.getElementById("valor").value;
  
	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
  
	bd.pesquisar(despesa);

	carregaListaDespesas();
	mostrarBotoesAcao();
  }
  

function carregaListaDespesas() {
	let despesas = bd.recuperarTodosRegistros();
	let listaDespesas = document.getElementById("listaDespesas");
	let filtro = getFiltro();
  
	listaDespesas.innerHTML = "";
  
	despesas.forEach(function (d) {
	  if (atendeFiltro(d, filtro)) {
		let linha = listaDespesas.insertRow(); //criando a linha
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`; //criaando as colunas
  
		//ajustar o tipo
		switch (d.tipo) {
		  case "1":
			d.tipo = "Alimentação";
			break;
		  case "2":
			d.tipo = "Educação";
			break;
		  case "3":
			d.tipo = "Lazer";
			break;
		  case "4":
			d.tipo = "Saúde";
			break;
		  case "5":
			d.tipo = "Transporte";
			break;
		}
  
		linha.insertCell(1).innerHTML = d.tipo;
		linha.insertCell(2).innerHTML = d.descricao;
		linha.insertCell(3).innerHTML = d.valor;
  
		//exibe botão de editar
		let btnEditar = document.createElement("button");
		btnEditar.className = "btn btn-primary btn-custom";
		btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
		btnEditar.onclick = function () {
		  editarDespesa(d.id);
		};
		linha.insertCell(4).append(btnEditar);
  
		//exibe botão de excluir
		let btnExcluir = document.createElement("button");
		btnExcluir.className = "btn btn-danger ml-2";
		btnExcluir.innerHTML = '<i class="fas fa-trash-alt"></i>';
		btnExcluir.onclick = function () {
		  excluirDespesa(d.id);
		};
		linha.insertCell(5).append(btnExcluir);
	  }
	});
	
  }
  
  function getFiltro() {
	return {
	  ano: document.getElementById("ano").value,
	  mes: document.getElementById("mes").value,
	  dia: document.getElementById("dia").value,
	  tipo: document.getElementById("tipo").value,
	  descricao: document.getElementById("descricao").value,
	  valor: document.getElementById("valor").value,
	};
  }
  
  function atendeFiltro(despesa, filtro) {
	return (
	  (filtro.ano === "" || despesa.ano == filtro.ano) &&
	  (filtro.mes === "" || despesa.mes == filtro.mes) &&
	  (filtro.dia === "" || despesa.dia == filtro.dia) &&
	  (filtro.tipo === "" || despesa.tipo == filtro.tipo) &&
	  (filtro.descricao === "" || despesa.descricao.includes(filtro.descricao)) &&
	  (filtro.valor === "" || despesa.valor == filtro.valor)
	);
  }
  
  


function editarDespesa(id) {
  let despesas = bd.recuperarTodosRegistros();

  // Procura a despesa pelo id fornecido
  let despesa = despesas.find(function (d) {
    return d.id === id;
  });

  if (!despesa) {
    alert("Despesa não encontrada.");
    return;
  }

  // Preenche os campos de entrada com os valores da despesa
  document.getElementById("ano").value = despesa.ano;
  document.getElementById("mes").value = despesa.mes;
  document.getElementById("dia").value = despesa.dia;
  document.getElementById("tipo").value = despesa.tipo;
  document.getElementById("descricao").value = despesa.descricao;
  document.getElementById("valor").value = despesa.valor;

  // exibe os botões "Salvar" e "Cancelar"
  document.getElementById("btnSalvar").style.display = "inline-block";
  document.getElementById("btnCancelar").style.display = "inline-block";

  // Define a função para salvar as alterações
  document.getElementById("btnSalvar").onclick = function () {
    salvarEdicaoDespesa(id);
  };

  // Define a função para cancelar a edição
  document.getElementById("btnCancelar").onclick = function () {
    cancelarEdicaoDespesa();
  };
}

// Função para salvar as alterações
function salvarEdicaoDespesa(id) {
	let despesa = new Despesa();

  if (despesa === null) {
    console.log("Despesa não encontrada");
    return;
  }

  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  despesa.ano = ano.value;
  despesa.mes = mes.value;
  despesa.dia = dia.value;
  despesa.tipo = tipo.value;
  despesa.descricao = descricao.value;
  despesa.valor = valor.value;

  localStorage.setItem(id, JSON.stringify(despesa));

  cancelarEdicaoDespesa();
  carregaListaDespesas();
}


function cancelarEdicaoDespesa() {
  document.getElementById('btnSalvar').style.display = 'none';
  document.getElementById('btnCancelar').style.display = 'none';
  limparCampos();
  carregaListaDespesas();
}

// Função para limpar os campos caso clique no botão "salvar" ou "cancelar"
function limparCampos() {
	document.getElementById('ano').value = '';
	document.getElementById('mes').value = '';
	document.getElementById('dia').value = '';
	document.getElementById('tipo').value = '';
	document.getElementById('descricao').value = '';
	document.getElementById('valor').value = '';
  }

  //modal para confirmação de deletar despesa
function excluirDespesa(id) {
  let confirmacao = document.getElementById('modal_titulo').innerHTML = 'Deseja realmente excluir essa despesa?'
  document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
  document.getElementById('modal_conteudo').innerHTML = 'Ao excluir, a despesa será deletada permanentemente.'
  document.getElementById('modal_btn').innerHTML = 'Excluir'
  document.getElementById('modal_btn').className = 'btn btn-danger'


  $('#modalRegistraDespesa').modal('show') 

  if (confirmacao) {
    bd.excluir(id);
    carregaListaDespesas();
  }
}

function mostrarBotoesAcao() {
	document.getElementById("btnCancelar").style.display = "flex";
  }