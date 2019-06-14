import React from "react";
import { View, Text, Alert, TouchableHighlight, TouchableOpacity, ActivityIndicator, Button, TextInput } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";

class HomeScreen extends React.Component {

  static navigationOptions = {
    title: 'Cursos',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  state = {
    cursos: [],
    isLoading: true
  }

  componentDidMount = async () => {
    const urlCursos = 'http://104.248.133.2:7001/cursos';
    const response = await fetch(urlCursos);
    const responseParsead = await response.json();

    this.setState({cursos: responseParsead, isLoading: false});
  }

  render() {

    if (this.state.isLoading) {
      return (
        <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        {this.state.cursos.map(curso => {
          return (
          <TouchableOpacity 
          onPress={() => this.props.navigation.navigate('Second', {
            id: curso.id
          })}
          key={curso.nome} style={{ 
              flexDirection: 'row', 
              padding: 12, 
              borderBottomColor: '#ccc', 
              borderBottomWidth: 1, 
              alignItems: 'center'
              }}>
            <Text style={{ marginLeft: 15, fontSize: 22}}>{curso.id}</Text>
            <Text style={{ marginLeft: 15, fontSize: 22}}>{curso.nome}</Text>
          </TouchableOpacity>
            )
          })}
      </View>
    );
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class DetailsScreen extends React.Component {

  static navigationOptions = {
    title: 'Detalhes da Pagina',
    headerStyle: {
      backgroundColor: 'red',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  state = {
    cursoDetalhado: [],
    alunosCadastro: [],
    isLoading: true,
    idCurso: null
  }

  componentDidMount = async () => {

    const { navigation } = this.props;
    const itemId = navigation.getParam('id');

    const urlCursoDetalhado = `http://104.248.133.2:7001/cursos/${itemId}`;
    const response = await fetch(urlCursoDetalhado);
    const responseParsead = await response.json();

    const urlAlunosInscritos = `http://104.248.133.2:7001/cursos/${itemId}/alunos-inscritos`;
    const responseAlunos = await fetch(urlAlunosInscritos);
    const responseParseadAlunos = await responseAlunos.json();

    this.setState({cursoDetalhado: responseParsead[0], alunosCadastro: responseParseadAlunos, isLoading: false , idCurso: itemId})
  }


  render() {

    if (this.state.isLoading) {
      return (
        <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#eee', padding: 20}}>
        <View style={{ backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 12}}>
          <Text>Id : {this.state.cursoDetalhado.id}</Text>
          <Text>Curso : {this.state.cursoDetalhado.nome}</Text>
          <Text>Professor : {this.state.cursoDetalhado.professor}</Text>
          <Text>Local : {this.state.cursoDetalhado.local}</Text>
        </View>

        <View style={{ marginTop: 10, backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 12}}>
          <View style={{ backgroundColor: '#bb',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15}}>
            <Text>ALUNOS CADASTRADOS</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {this.state.alunosCadastro.map(aluno => {
            return (
            <TouchableOpacity
            key={aluno.nome} style={{ 
                flexDirection: 'row', 
                padding: 12, 
                borderBottomColor: '#ccc', 
                borderBottomWidth: 1, 
                alignItems: 'center'
                }}>
              <Text style={{ marginLeft: 15, fontSize: 22}}>{aluno.id}</Text>
              <Text style={{ marginLeft: 15, fontSize: 22}}>{aluno.nome}</Text>
            </TouchableOpacity>
              )
            })}
        </View>
        <View>
          <Button
            onPress={() => this.props.navigation.navigate('Third', {
              id: this.state.idCurso
            })}
            title="Cadastrar Aluno"
            color="#FF0000"/>
        </View>
        </View>
    )
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class CadastroAlunos extends React.Component {

  static navigationOptions = {
    title: 'Cadastrar Aluno',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  urlAlunos = '';

  state = {
    isLoading: true,
    cursoId: null
  }

  componentDidMount = async () => {

    const { navigation } = this.props;
    const idCurso = navigation.getParam('id');

    urlAlunos = `http://104.248.133.2:7001/cursos/${idCurso}/alunos-inscritos`;
    const response = await fetch(urlAlunos);
    const responseParsead = await response.json();

    this.setState({cursos: responseParsead, isLoading: false});
  }

  cadastrarAluno = async () => {

    const response = await fetch(urlAlunos,{
      method: 'POST',headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nome: this.state.nome })
    });
      
    if (response.ok) {
      Alert.alert('Cadastrado com Sucesso!');
    } else {
      Alert.alert('Erro!');
    }
    return await response.json();
  }

  render() {

    if (this.state.isLoading) {
      return (
        <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#eee', padding: 20}}>
        <View style={{ marginTop: 10, backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 12}}>
          <View style={{ backgroundColor: '#bb',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15}}>
            <Text>Cadastrar Aluno</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text>Nome: </Text>
          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(nome) => this.setState({nome: nome})}
              value={this.state.nome}/>
            <Button
              onPress={() => { this.cadastrarAluno(); }}
              title="Cadastrar"
              color="#841584"/>
        </View>
      </View>
    )
  }

}


const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  Second: {
    screen: DetailsScreen
  },
  Third: {
    screen: CadastroAlunos
  }
});

export default createAppContainer(AppNavigator);
