/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
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
      data.veiculos.forEach(item => insertList(item.acessorios, item.id, item.nome, item.ano_fabricacao, item.ano_modelo_fabricacao, item.valor_diaria))
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
  Função para inserir novos veículos (POST) na base de dados
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputId, inputNome, inputano, inputmodelo, inputdiaria) => {
  
  
  let btnUpdateAdd = $('#btn').innerHTML;
  
    let url = 'http://127.0.0.1:5001/veiculo';
    const formData = new FormData();
    formData.append('nome', inputNome);
    formData.append('ano_fabricacao', inputano);
    formData.append('ano_modelo_fabricacao', inputmodelo);
    formData.append('valor_diaria', inputdiaria);
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
const putItem = async (inputId, inputNome, inputano, inputmodelo, inputdiaria) => {
  
  
  let btnUpdateAdd = $('#btn').innerHTML;
  
  let url = 'http://127.0.0.1:5001/update_veiculo';
  const formData = new FormData();
  document.getElementById("newNome").innerHTML = inputNome;
  document.getElementById("newAno").innerHTML = inputano;
  document.getElementById("newModelo").innerHTML = inputmodelo;
  document.getElementById("newDiaria").innerHTML = inputdiaria;
  formData.append('id', inputId);
  formData.append('nome', inputNome);
  formData.append('ano_fabricacao', inputano);
  formData.append('ano_modelo_fabricacao', inputmodelo);
  formData.append('valor_diaria', inputdiaria);
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
  Função para criar os botões para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent,props={},coluna) => {
  let span = document.createElement("span");
  let btn = document.createElement("button");
  btn.style.color = 'red';
  btn.style.backgroundColor = "yellow";

  if (coluna==3) {
    btn.onclick = editElement;
    span.className = "edit glyphicon  glyphicon-pencil";

  } else if (coluna==4){
    btn.onclick = removeElement;
    span.className = "close glyphicon  glyphicon-trash";

  } else if (coluna==5){
      btn.innerHTML=props.acessorios.length;
      btn.onclick = removeElement;
      span.className = "acessorios glyphicon glyphicon-eye-open";  
  }
   
  span.appendChild(btn);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para pegar um item da lista de acordo com o click no botão editar e colocá-lo para alteração
  --------------------------------------------------------------------------------------
  desabilitada temporariamente, implantar em um segundo momento
*/
const editElement = () => {
  let edit = document.getElementsByClassName("edit");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < edit.length; i++) {
    edit[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[0].innerHTML;
      const nomeItem = div.getElementsByTagName('td')[1].innerHTML;
      const anoItem = div.getElementsByTagName('td')[2].innerHTML;
      const modeloItem = div.getElementsByTagName('td')[3].innerHTML;
      const diariaItem = div.getElementsByTagName('td')[4].innerHTML;

      document.getElementById("newId").value=idItem;
      document.getElementById("newNome").value=nomeItem;
      document.getElementById("newAno").value=anoItem;
      document.getElementById("newModelo").value=modeloItem;
      document.getElementById("newDiaria").value=diariaItem;
      btnadd.value = "Editar";
      btnadd.innerHTML = "Atualizar";

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
  Função para adicionar um novo item ou alterar um já existente com nome, ano e modelo de fabricação, e valor da diária para locação 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputId = document.getElementById("newId").value;
  let inputnome = document.getElementById("newNome").value;
  let inputano = document.getElementById("newAno").value;
  let inputmodelo = document.getElementById("newModelo").value;
  let inputdiaria = document.getElementById("newDiaria").value;
  let btntxt = btnadd.innerHTML

  if (inputnome === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputano) || isNaN(inputmodelo) || isNaN(inputdiaria)) {
    alert("ano, modelo e diária precisam ser números!");
  } else {
    if (btntxt === "Adicionar"){
      insertList([],0,inputnome, inputano, inputmodelo, inputdiaria);
      postItem(0,inputnome, inputano, inputmodelo, inputdiaria);
      btnadd.innerHTML = "Atualizar";
    } else if (btntxt === "Atualizar"){
      
      putItem(inputId, inputnome, inputano, inputmodelo, inputdiaria);
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
const insertList = (acessorios=0, id=0, nome, ano, modelo, diaria) => {
  var item = [id, nome, ano,modelo, diaria]
  var table = document.getElementById('myTable');
  var row = table.insertRow();
  

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];

    //imprimir os acessorios
    acessorios.forEach((e)=>{ console.log(e); });
   
  }
  //if (acessorios.length>0) {
    insertButton(row.insertCell(-1),{className:'acessorios',value: 'acessorios',acessorios}, 5);
  //em um próximo passo será exibir os acessórios ao se clicar no ícone eye
  //}

  //botões de editar/atualizar nas tr suprimidos nessa primeira versão
  //insertButton(row.insertCell(-1),{className:'edit',value:'editar'}, 3)
  insertButton(row.insertCell(-1),{className:'close', value:'excluir'},4);
  
  console.log(acessorios)
  document.getElementById("newNome").value = "";
  document.getElementById("newAno").value = "";
  document.getElementById("newModelo").value = "";
  document.getElementById("newDiaria").value = "";

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


//pegar na tabela de veículos a linha que foi clicada
$(document).ready(function(){
    $("#myTable").on('click','tr', function() {
      var linha = $(this)[0];
      let idlinha = linha.getElementsByTagName('td')[0].innerHTML;
      let nomelinha = linha.getElementsByTagName('td')[1].innerHTML;
      let anolinha = linha.getElementsByTagName('td')[2].innerHTML;
      let modelolinha = linha.getElementsByTagName('td')[3].innerHTML;
      let diarialinha = linha.getElementsByTagName('td')[4].innerHTML;


      document.getElementById("newId").value = idlinha;
      document.getElementById("newNome").value = nomelinha;
      document.getElementById("newAno").value = anolinha;
      document.getElementById("newModelo").value = modelolinha;
      document.getElementById("newDiaria").value = diarialinha;
      btnadd.innerHTML="Atualizar"
      
      //Botões comentados nessa primeira versão
      //$('#btnEdit').removeAttr('disabled');
      //$('#btnRemove').removeAttr('disabled');
      $('#btnaddacessorio').removeAttr('disabled');
      //$('#btnadd').attr('disabled','disabled');
      //$('#btnadd').innerHTML = 'Alterar'
      let controleLinha=document.getElementById('ln')
      controleLinha.innerHTML= linha.rowIndex;
      //$('#btnadd').disabled= true;
    
    });
  });




