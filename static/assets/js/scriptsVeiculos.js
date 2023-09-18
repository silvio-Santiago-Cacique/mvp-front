/*
  --------------------------------------------------------------------------------------
  Função para obter os dados de endereçamento postal com API externa viacep
  --------------------------------------------------------------------------------------
*/
const getCep = async (eDados) => {
  function limpa_formulário_cep() {
    // Limpa valores do formulário de cep.
    $("#rua"+eDados).val('');
    $("#bairro"+eDados).val('');
    $("#localidade"+eDados).val('');
    $("#uf"+eDados).val('');
    $("#ibge"+eDados).val('');
 }

    //Consulta o webservice viacep.com.br/
    $.getJSON("https://viacep.com.br/ws/"+ $("#local"+eDados).val() +"/json/?callback=?", function(dados) {
        $("#rua"+eDados).val('...');
        $("#bairro"+eDados).val('...');
        $("#localidade"+eDados).val('...');
        $("#uf"+eDados).val('...');
        $("#ibge"+eDados).val('...');
        if (!("erro" in dados)) {
            //Atualiza os campos com os valores da consulta.
            $("#rua"+eDados).val(dados.logradouro);
            $("#bairro"+eDados).val(dados.bairro);
            $("#localidade"+eDados).val(dados.localidade);
            $("#uf"+eDados).val(dados.uf);
            $("#ibge"+eDados).val(dados.ibge);
        }//end if.
        else {
            //CEP pesquisado não foi encontrado.
            limpa_formulário_cep();
            alert("CEP não encontrado.");
        }
    });

}
    
/*
  API externa brasilAPI
  //https://brasilapi.com.br/api/cptec/v1/cidade ->busca codigo ibge da cidade
  let url = 'https://brasilapi.com.br/api/cep/v2/14400000'; ->busca informações da localidade, conforme cep informado
 
 */
 
  /*
  --------------------------------------------------------------------------------------
  Função para obter os dados do cliente com API interna cliente
  --------------------------------------------------------------------------------------
*/
const getCliente = async (eDados) => {
  function limpa_formulário_cliente() {
    // Limpa valores do formulário de cep.
    $("#nome"+eDados).val('');
    $("#cpf"+eDados).val('');
    $("#cep"+eDados).val('');
    $("#rua"+eDados).val('');
    $("#bairro"+eDados).val('');
    $("#localidade"+eDados).val('');
    $("#uf"+eDados).val('');
    $("#ibge"+eDados).val('');
 }
 nome_cliente=$("#nome"+eDados).val(); 
 //cpf_cliente= $("#cpf"+eDados).val('');
 console.log(nome_cliente);

let url = 'http://127.0.0.1:5002/cliente?nome=' + nome_cliente;
fetch(url, {
   method: 'get',
 })
   .then((response) => response.json())
   .then((data) => {
      console.log(data)
      $("#nome"+eDados).val(data.nome);
      $("#cpf"+eDados).val(data.cpf);
      $("#local"+eDados).val(data.endereco[0].Cep);
      $("#cep"+eDados).val(data.endereco[0].Cep);
      $("#rua"+eDados).val(data.endereco[0].Logradouro);
      $("#bairro"+eDados).val(data.endereco[0].Bairro);
      $("#localidade"+eDados).val(data.endereco[0].Cidade);
      $("#uf"+eDados).val(data.endereco[0].Estado);
      $("#ibge"+eDados).val(data.endereco[0].País);
  
    })
   .catch((error) => {
     console.error('Error:', error);
   });

}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de veículos existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  document.getElementById("newId").value='0';
  let url = 'http://127.0.0.1:5001/veiculos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.veiculos.forEach(item => insertList(item.acessorios, item.id, item.nome, item.ano_fabricacao, item.ano_modelo_fabricacao, item.placa ,item.valor_diaria, item.status))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()



/*
  --------------------------------------------------------------------------------------
  Função para inserir novo veículo (POST) na base de dados
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputId, inputNome, inputAno, inputModelo, inputPlaca, inputDiaria, inputStatus) => {
  
  let btnUpdateAdd = $('#btn').innerHTML;
  
  let url = 'http://127.0.0.1:5001/veiculo';
  const formData = new FormData();
  formData.append('id', inputId);
  formData.append('nome', inputNome);
  formData.append('ano_fabricacao', inputAno);
  formData.append('ano_modelo_fabricacao', inputModelo);
  formData.append('placa', inputPlaca);
  formData.append('valor_diaria', inputDiaria);
  formData.append('status', inputStatus);
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}
  
/*
  --------------------------------------------------------------------------------------
  Função para efetuar as alterações (PUT) na base de dados
  --------------------------------------------------------------------------------------
*/
const putItem = async (inputId, inputNome, inputAno, inputModelo, inputPlaca, inputDiaria, inputStatus) => {
 
  let btnUpdateAdd = $('#btn').innerHTML;
  
  let url = 'http://127.0.0.1:5001/update_veiculo';
  const formData = new FormData();
  document.getElementById("newNome").innerHTML = inputNome;
  document.getElementById("newAno").innerHTML = inputAno;
  document.getElementById("newModelo").innerHTML = inputModelo;
  document.getElementById("newPlaca").innerHTML = inputPlaca;
  document.getElementById("newDiaria").innerHTML = inputDiaria;
  document.getElementById("newStatus").innerHTML = inputStatus;
  
  formData.append('id', inputId);
  formData.append('nome', inputNome);
  formData.append('ano_fabricacao', inputAno);
  formData.append('ano_modelo_fabricacao', inputModelo);
  formData.append('placa', inputPlaca);
  formData.append('valor_diaria', inputDiaria);
  formData.append('status', inputStatus);
 
  fetch(url, {
    method: 'put',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
 
  btnadd.innerHTML= "Adicionar";

}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5001/veiculo?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo Acessório a um veículo já previamente cadastrado na API
  --------------------------------------------------------------------------------------
*/
const postAcessorio = async () => {
  
  let inputId = document.getElementById("newId").value;
  let inputAcessorio = document.getElementById("newAcessorio").value;
   
    let url = 'http://127.0.0.1:5001/acessorio';
    const formData = new FormData();
    formData.append('veiculo_id', inputId);
    formData.append('nome', inputAcessorio);
    //document.getElementById("newAcessorio").value='';
    
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => { response.json()
          document.getElementById("newAcessorio").value='';
          console.log("Acessório adicionado");
        })
      .catch((error) => {
        console.error('Error:', error);
      });
      $('#btnEdit').Attr('disabled', 'disabled');
      $('#btnadd').removeAttr('disabled');
      
}


/*
  --------------------------------------------------------------------------------------
  Função para criar os botões para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent,props={},coluna) => {
  let span = document.createElement("span");
  let btn = document.createElement("button");
  let a = document.createElement("a");
  btn.style.color = 'red';
  btn.style.backgroundColor = "yellow";

  if (coluna==3) {
    btn.onclick = editElement;
    span.className = "edit glyphicon  glyphicon-pencil";

  } else if (coluna==4){
    btn.onclick = removeElement;
    span.className = "close glyphicon  glyphicon-trash";

  } else if (coluna==5){
      //span.onclick = listaAcessorios;
      //span.className = "acessorios glyphicon glyphicon-eye-open"; 
      span.innerHTML= "  " + props.listaAcessorios.length -1 + " Itens";
      span.title= props.listaAcessorios
      //if (props.listaAcessorios==0) {
      //  span.title="Sem Acessorios"
      //} else if (props.listaAcessorios>0){
      //  span.title= props.listaAcessorios
      //}
      
  }
   
  //span.appendChild(btn);
  parent.appendChild(span);
  parent.appendChild(a);
}

/*
  --------------------------------------------------------------------------------------
  Função para pegar um item da lista de acordo com o click no botão editar e colocá-lo para alteração
  --------------------------------------------------------------------------------------
*/
const editElement = () => {
  let edit = document.getElementsByClassName("edit");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < edit.length; i++) {
    edit[i].onclick = function () {
      let div = this.parentElement.parentElement;
      let idItem = div.getElementsByTagName('td')[0].innerHTML;
      let nomeItem = div.getElementsByTagName('td')[1].innerHTML;
      let anoItem = div.getElementsByTagName('td')[2].innerHTML;
      let modeloItem = div.getElementsByTagName('td')[3].innerHTML;
      let placaItem = div.getElementsByTagName('td')[4].innerHTML;
      let diariaItem = div.getElementsByTagName('td')[5].innerHTML;
      let statusItem = div.getElementsByTagName('td')[6].innerHTML;

      document.getElementById("newId").value=idItem;
      document.getElementById("newNome").value=nomeItem;
      document.getElementById("newAno").value=anoItem;
      document.getElementById("newModelo").value=modeloItem;
      document.getElementById("newPlaca").value=placaItem;
      document.getElementById("newDiaria").value=diariaItem;
      document.getElementById("newStatus").value=statusItem;
      btnadd.value = "Editar";
      btnadd.innerHTML = "Atualizar";
      console.log(statuslinha)
      if (statuslinha=="Disponível"){
        $('#btnRent').removeclass('disabled');
      }
    }
  }
 }

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close  (critério pelo nome)
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
    
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[1].innerHTML
      if (confirm("Você tem certeza? excluir o item " & nomeItem)) {
        div.remove();
        deleteItem(nomeItem);
        alert("Removido!");
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item ou alterar um já existente com nome, ano e modelo de fabricação, e valor da diária para locação 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputId = document.getElementById("newId").value;
  let inputnome = document.getElementById("newNome").value;
  let inputano = document.getElementById("newAno").value;
  let inputmodelo = document.getElementById("newModelo").value;
  let inputplaca = document.getElementById("newPlaca").value;
  let inputdiaria = document.getElementById("newDiaria").value;
  let inputstatus = document.getElementById("newStatus").value;
  let btntxt = btnadd.innerHTML

  if (inputnome === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputano) || isNaN(inputmodelo) || isNaN(inputdiaria)) {
    alert("ano, modelo e diária precisam ser números!");
  } else {
    if (btntxt === "Adicionar"){
      insertList([],0,inputnome, inputano, inputmodelo, inputplaca ,inputdiaria, inputstatus);
      postItem(0,inputnome, inputano, inputmodelo, inputplaca ,inputdiaria, inputstatus);
      btnadd.innerHTML = "Atualizar";
    } else if (btntxt === "Atualizar"){
      
      putItem(inputId, inputnome, inputano, inputmodelo, inputplaca ,inputdiaria, inputstatus);
      btnadd.innerHTML = "Adicionar";
    }
    alert("Item adicionado/alterado!");
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (acessorios=0, id=0, nome, ano, modelo, placa, diaria, status) => {
  var item = [id, nome, ano,modelo, placa, diaria, status]
  var table = document.getElementById('myTable');
  var row = table.insertRow();
  
  let listaAcessorios=[]
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  //imprimir os acessorios
  acessorios.forEach((e)=>{ 
    console.log(e.nome);
    listaAcessorios.push( e.nome )
  });
  listaAcessorios.push(acessorios.length)
  insertButton(row.insertCell(-1),{className:'acessorios',value: 'acessorios',listaAcessorios}, 5);
  //botões de editar/atualizar nas tr suprimidos nessa primeira versão
  insertButton(row.insertCell(-1),{className:'edit',value:'editar'}, 3)
  insertButton(row.insertCell(-1),{className:'close', value:'excluir'},4);
  
  document.getElementById("newNome").value = "";
  document.getElementById("newAno").value = "";
  document.getElementById("newModelo").value = "";
  document.getElementById("newPlaca").value = "";
  document.getElementById("newDiaria").value = "";
  document.getElementById("newStatus").value = "";

  removeElement()
}

//Totalizar colunas nas tabelas
const totalizar = (coluna) => {
  var total = 0;
  $(document).ready(function() {
      $('table tbody tr').each(function() {
          total += parseFloat(this.children[coluna].innerHTML);
      });
      $('table tfoot td').text('Total: ' + total);
  });
}

const rentItem = () => {

  //limpar campos do cliente
  $('#nomeCliente').val('');
  $('#cpfCliente').val('');
  $('#cepCliente').val('');
  $('#localCliente').val('');
  $('#ruaCliente').val('');
  $('#bairroCliente').val('');
  $('#localidadeCliente').val('');
  $('#ufCliente').val('');
  $('#ibgeCliente').val('');

  //limpar campos do local da retira
  $('#localRetirada').val('');
  $('#ruaRetirada').val('');
  $('#bairroRetirada').val('');
  $('#localidadeRetirada').val('');
  $('#ufRetirada').val('');
  $('#ibgeRetirada').val('');
  $('#dataRetirada').val('');
  $('#horaRetirada').val('');

  //limpar campos do local da Entrega
  $('#localEntrega').val('');
  $('#ruaEntrega').val('');
  $('#bairroEntrega').val('');
  $('#localidadeEntrega').val('');
  $('#ufEntrega').val('');
  $('#ibgeEntrega').val('');
  $('#dataEntrega').val('');
  $('#horaEntrega').val('');

  //exibir a tela para entrada do dados da locação do veículo selecionado
  let locar = document.getElementById("locar");
  locar.classList.toggle("hide");
  //locar.toggle('hide')
}

//pegar na tabela de veículos a linha que foi clicada
$(document).ready(function(){
    $("#myTable").on('click','tr', function() {
      var linha = $(this)[0];
      let idlinha = linha.getElementsByTagName('td')[0].innerHTML;
      let nomelinha = linha.getElementsByTagName('td')[1].innerHTML;
      let anolinha = linha.getElementsByTagName('td')[2].innerHTML;
      let modelolinha = linha.getElementsByTagName('td')[3].innerHTML;
      let placalinha = linha.getElementsByTagName('td')[4].innerHTML;
      let diarialinha = linha.getElementsByTagName('td')[5].innerHTML;
      let statuslinha = linha.getElementsByTagName('td')[6].innerHTML;

      document.getElementById("newId").value = idlinha;
      document.getElementById("newNome").value = nomelinha;
      document.getElementById("newAno").value = anolinha;
      document.getElementById("newModelo").value = modelolinha;
      document.getElementById("newPlaca").value = placalinha;
      document.getElementById("newDiaria").value = diarialinha;
      document.getElementById("newStatus").value = statuslinha;
      btnadd.innerHTML="Atualizar";
      
      let botaoRent = document.getElementById("btnRent")
      if (statuslinha!="Alugado"){
        botaoRent.className = "btn btn-primary mb-3  glyphicon glyphicon-tags"
      } else {
        botaoRent.className = "btn btn-primary mb-3  glyphicon glyphicon-tags disabled"
      }
      
      $('#btnaddacessorio').removeAttr('disabled');

      let controleLinha=document.getElementById('ln');
      controleLinha.innerHTML= linha.rowIndex;
    
    });
  });

    

  $(document).ready(function() {
       
    //Quando o campo data retirada perde o foco.
    $("#dataRetirada").blur(function() {
      console.log(this.value)
      let data_antiga=new Date();
      let nova_data = new Date();

      data_antiga=this.val()
      console.log(data_antiga);

      nova_data= nova_data.setDate(data_antiga.getDay()+3);
      console.log(nova_data);
      
      $("#dataEntrega").val(nova_data);
      
    });

  });
