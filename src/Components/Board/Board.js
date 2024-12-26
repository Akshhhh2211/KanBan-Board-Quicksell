import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MoreHorizontal, Plus } from "react-feather";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import "./Board.css";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState(""); // State for new card title
  const [showNewCardInput, setShowNewCardInput] = useState(false); // Toggle new card input

  const sortCards = () => {
    if (props.orderingOption === "priority") {
      return [...props.board.cards].sort((a, b) => b.priority - a.priority);
    } else if (props.orderingOption === "title") {
      return [...props.board.cards].sort((a, b) => a.title.localeCompare(b.title));
    }
    return props.board.cards;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedCards = Array.from(props.board.cards);
    const [movedCard] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, movedCard);

    props.updateBoardCards(props.board.id, reorderedCards);
  };

  const handleAddCard = () => {
    if (newCardTitle.trim() === "") return;

    const newCard = {
      id: Date.now(), // Generate a unique ID
      title: newCardTitle,
      date: null,
      tasks: [],
      labels: [],
      Name: "User", // Default user, modify as needed
    };

    props.addCardToBoard(props.board.id, newCard); // Pass new card to the parent
    setNewCardTitle("");
    setShowNewCardInput(false); // Hide input after adding the card
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={props.board.id}>
        {(provided) => (
          <div
            className="board"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className="board_header">
              <p className="board_header_title">
                {props.board?.title}
                <span>{props.board?.cards?.length || 0}</span>
              </p>
              <div className="board_header_actions">
                <Plus
                  className="add-card-icon"
                  onClick={() => setShowNewCardInput(!showNewCardInput)}
                />
                <MoreHorizontal
                  className="more-icon"
                  onClick={() => setShowDropdown(true)}
                />
                {showDropdown && (
                  <Dropdown
                    class="board_dropdown"
                    onClose={() => setShowDropdown(false)}
                  >
                    <p onClick={() => props.removeBoard()}>Delete Board</p>
                  </Dropdown>
                )}
              </div>
            </div>
            {showNewCardInput && (
              <div className="new-card-input">
                <input
                  type="text"
                  placeholder="Enter card title"
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                />
                <button onClick={handleAddCard}>Add</button>
                <button onClick={() => setShowNewCardInput(false)}>Cancel</button>
              </div>
            )}
            <div className="board_cards custom-scroll">
              {sortCards().map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Card
                        card={item}
                        boardId={props.board.id}
                        removeCard={props.removeCard}
                        updateCard={props.updateCard}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
