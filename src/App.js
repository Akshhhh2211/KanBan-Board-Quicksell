import React, { useEffect, useState } from "react";
import axios from "axios";
import Board from "./Components/Board/Board";
import "./App.css";
import { DragDropContext } from "react-beautiful-dnd";

function App() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true); // Define the loading state
  const [boards, setBoards] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Define dropdown state
  const [selectedOption, setSelectedOption] = useState(""); // For dropdown selection

  useEffect(() => {
    // Fetching data from the Quicksell API
    axios
      .get("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => {
        const apiData = response.data;
        setApiData(apiData);
        setLoading(false);

        // Default grouping by Status
        const groupedBoards = groupDataByStatus(apiData);
        setBoards(groupedBoards);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Grouping by Status
  const groupDataByStatus = (apiData) => {
    if (!apiData) return [];
    const boardsByStatus = {};
    apiData.tickets.forEach((ticket) => {
      const status = ticket.status;
      if (!boardsByStatus[status]) {
        boardsByStatus[status] = { id: status, title: status, cards: [] };
      }
      boardsByStatus[status].cards.push(ticket);
    });
    return Object.values(boardsByStatus);
  };

  // Grouping by User
  const groupDataByUser = (apiData) => {
    if (!apiData) return [];
    const boardsByUser = {};
    apiData.tickets.forEach((ticket) => {
      const user = apiData.users.find((u) => u.id === ticket.userId);
      if (user) {
        const username = user.name;
        if (!boardsByUser[username]) {
          boardsByUser[username] = { id: username, title: username, cards: [] };
        }
        boardsByUser[username].cards.push(ticket);
      }
    });
    return Object.values(boardsByUser);
  };

  // Grouping by Priority
  const groupDataByPriority = (apiData) => {
    if (!apiData) return [];
    const boardsByPriority = {};
    apiData.tickets.forEach((ticket) => {
      const priority = ticket.priority;
      if (!boardsByPriority[priority]) {
        boardsByPriority[priority] = { id: priority.toString(), title: `Priority ${priority}`, cards: [] };
      }
      boardsByPriority[priority].cards.push(ticket);
    });
    return Object.values(boardsByPriority);
  };

  // Ordering by Title (Ascending)
  const orderDataByAscending = (apiData) => {
    const sortedData = [...apiData.tickets].sort((a, b) => a.title.localeCompare(b.title));
    return [{ id: "sorted-title", title: "Sorted by Title", cards: sortedData }];
  };

  // Ordering by Priority (Descending)
  const orderDataByDescending = (apiData) => {
    const sortedData = [...apiData.tickets].sort((a, b) => b.priority - a.priority);
    return [{ id: "sorted-priority",title: "Sorted by Priority", cards: sortedData }];
  };

  // Handle dropdown selection changes
  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    if (apiData) {
      let groupedBoards = [];
      if (selectedValue === "status") {
        groupedBoards = groupDataByStatus(apiData);
      } else if (selectedValue === "user") {
        groupedBoards = groupDataByUser(apiData);
      } else if (selectedValue === "priority") {
        groupedBoards = groupDataByPriority(apiData);
      } else if (selectedValue === "ascending") {
        groupedBoards = orderDataByAscending(apiData);
      } else if (selectedValue === "descending") {
        groupedBoards = orderDataByDescending(apiData);
      }
      setBoards(groupedBoards);
    }
  };

  const addCardToBoard = (boardId) => {

    const newCard = {

      id: `new-${Date.now()}`,

      title: "New Card",

      description: "This is a new card",

    };



    const updatedBoards = boards.map((board) => {

      if (board.id === boardId) {

        return { ...board, cards: [...board.cards, newCard] };

      }

      return board;

    });



    setBoards(updatedBoards);

  };



  const onDragEnd = (result) => {

    const { source, destination } = result;



    if (!destination) return;



    if (

      source.droppableId === destination.droppableId &&

      source.index === destination.index

    ) {

      return;

    }



    const sourceBoardIndex = boards.findIndex(

      (board) => board.id === source.droppableId

    );

    const destinationBoardIndex = boards.findIndex(

      (board) => board.id === destination.droppableId

    );



    const sourceBoard = boards[sourceBoardIndex];

    const destinationBoard = boards[destinationBoardIndex];



    const [movedCard] = sourceBoard.cards.splice(source.index, 1);

    destinationBoard.cards.splice(destination.index, 0, movedCard);



    const updatedBoards = [...boards];

    updatedBoards[sourceBoardIndex] = sourceBoard;

    updatedBoards[destinationBoardIndex] = destinationBoard;

    setBoards(updatedBoards);

  };



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="app_nav">
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: "5px",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='21' y1='4' x2='14' y2='4'%3E%3C/line%3E%3Cline x1='10' y1='4' x2='3' y2='4'%3E%3C/line%3E%3Cline x1='21' y1='12' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='8' y1='12' x2='3' y2='12'%3E%3C/line%3E%3Cline x1='21' y1='20' x2='16' y2='20'%3E%3C/line%3E%3Cline x1='12' y1='20' x2='3' y2='20'%3E%3C/line%3E%3Cline x1='14' y1='1' x2='14' y2='7'%3E%3C/line%3E%3Cline x1='8' y1='9' x2='8' y2='15'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='16' y2='23'%3E%3C/line%3E%3C/svg%3E\") no-repeat left 8px center",
            }}
          >
            <span style={{ marginRight: "8px", marginLeft: "20px" }}>Display</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon"
              style={{ width: "16px", height: "16px" }}
            >
              <path d="M7 10l5 5 5-5" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="dropdown-content">
              <div className="dropdown-section">
                <span className="section-label">Grouping</span>
                <select className="dropdown-select" onChange={handleOptionChange}>
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              <div className="dropdown-section">
                <span className="section-label">Ordering</span>
                <select className="dropdown-select" onChange={handleOptionChange}>
                  <option value="ascending">Title</option>
                  <option value="descending">Priority</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>

<div className="app_boards_container">
  <div className="app_boards">
  {boards.map((board, index) => (
<div key={index} className="board-container">

<Board board={board}
addCardToBoard={addCardToBoard} 
updateBoardCards={(boardId, updatedCards) => {
const updatedBoards = boards.map((b) =>
  b.id === boardId ? { ...b, cards: updatedCards } : b
);
setBoards(updatedBoards);
}}

removeBoard={() => {
setBoards(boards.filter((b) => b.id !== board.id));
}}

removeCard={(boardId, cardId) => {
const updatedBoards = boards.map((b) => {
  if (b.id === boardId) {
    return {
      ...b,
      cards: b.cards.filter((card) => card.id !== cardId),
    };
  }
  return b;
});
setBoards(updatedBoards);
}}

updateCard={(boardId, updatedCard) => {
const updatedBoards = boards.map((b) => {
  if (b.id === boardId) {
    return {
      ...b,
      cards: b.cards.map((card) =>
        card.id === updatedCard.id ? updatedCard : card
      ),
    };
  }

  return b;

});

setBoards(updatedBoards);

}} />

</div>

))}

  </div>
</div>
</DragDropContext>
    </div>
  );
}

export default App;
