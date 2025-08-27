import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]); //Estado para armazenar a lista de tarefas
  const [newTask, setNewTask] = useState(""); //Estado para o texto da nova tarefa
  const [isDrarkMode, setIsDarkMode] = useState (false) //estado para alterar entre os temas 

  useEffect(() =>{
    const loadTasks = async () => {
      try {
       const SavedTasks = await AsyncStorage.getItem ("tasks");
       SavedTasks && setTasks(JSON.parse(SavedTasks));
      } catch (error){
        console.error("Erro ao carregar tarefas:", error);
      }
    };

    loadTasks();
  },[])



  useEffect(() =>{
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem("tasks",JSON.stringify(tasks));
      } catch (error){
        console.error("Erro ao salvar tarefas:", error);
      }
    };

    saveTasks();
  },[tasks])


  const addTask = () => {
    if (newTask.trim().length > 0) {
      //Garante que a tarefa não seja vazia
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now().toString(), text: newTask.trim(), completed: false }, //Cria uma nova tarefa com id unico
      ]);
      setNewTask(""); // Limpar o campo de input
      Keyboard.dismiss(); // Fecha o teclado do usuário
    } else {
      Alert.alert("Atenção", "Por favor, digite uma tarefa.");
    }
  };

  const toggleTaskCompleted = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => [
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)),
        },
      ]
    ),
  ];

  const renderlist = ({ item }) => (
    <View style={[styles.taskItem, isDrarkMode && {backgroundColor:"#333", borderColor:"#555"}]} key={item.id}>
      <TouchableOpacity
        onPress={() => toggleTaskCompleted(item.id)}
        style={styles.taskTextContainer}
      >
        <Text
          style={[styles.taskText, item.completed && styles.completedTaskItem, isDrarkMode && {color: "#ccc"},]}
        >
          {" "}
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.taskText}> 🗑️ </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
     style={[styles.container, isDrarkMode ? {backgroundColor: "#121212"} : {backgroundColor: "#e0f7fa"}, ]}>
      {/* cabeçalho */}
      <View style={[styles.topBar, isDrarkMode && {backgroundColor: "#1e1e1e", borderBottomColor:"#333"},]}>
        <Text style={[styles.topBarTitle, isDrarkMode && { color:"#fff"}, ]}>Minhas Tarefas</Text>
        <TouchableOpacity onPress={() => setIsDarkMode(!isDrarkMode)}> 
          <Text>{isDrarkMode ? '🌞' : '🌛'}</Text>
        </TouchableOpacity>
      </View>

      {/* Local onde o usuário insere as tarefas */}
      <View style={[styles.card, isDrarkMode && {backgroundColor:"#1e1e1e"}]}>
        <TextInput
          style={[styles.input, isDrarkMode && {backgroundColor:"#333", color:"#fff", borderBlockColor:"#555"},]}
          placeholder="Adicionar nova tarefa..."
          placeholderTextColor={isDrarkMode ? '#888' : "#333"}
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask} //Adiciona a tarefa ao pressionar Enter no teclado
        />
        <TouchableOpacity style={[styles.addButton, isDrarkMode && {backgroundColo:"#00796b"},]} onPress={addTask}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tarefas do usuário */}
      <FlatList
        style={styles.flatList}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderlist}

        //   <View key={item.id} style={styles.taskItem}>
        //     <Text>{item.text}</Text>
        //     <TouchableOpacity>
        //       <Text>🗑️</Text>
        //     </TouchableOpacity>
        //   </View>
        // )}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyListText, isDrarkMode && {color:"#888"}]}>
            Nenhuma tarefa adicionada ainda.
          </Text>
        )}
        contentContainerStyle={styles.flatListContent}
      />

      <StatusBar style={isDrarkMode ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0f7fa",
    flex: 1,
  },
  topBar: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50, //ajuste para a barra de status
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  topBarTitle: {
    color: "#00796b",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    color: "#000",
    shadowColor: "#000",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  input: {
    backgroundColor: "#fcfcfc",
    color: "#333",
    borderColor: "#b0bec5",
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    fontSize: 18,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#009688",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 10, // Espaçamento no final da lista
  },
  taskItem: {
    backgroundColor: "#fff",
    color: "#333",
    borderColor: "rgba(0,0,0,0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
  },
  taskTextContainer: {
    flex: 1, //Permite que o texto ocupe o espaço disponível
    marginRight: 10,
  },
  taskText: {
    color: "#000",
    fontSize: 18,
    flexWrap: "wrap", //Permite que o texto quebre linha
  },
  completedTaskItem: {
    textDecorationLine: "line-through", // Risca o texto
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    // color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyListText: {
    color: "#9e9e9e",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
