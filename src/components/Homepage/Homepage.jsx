import React, { useEffect, useState , useRef} from "react";
import "./homepage.css";
import { ReactComponent as Down } from "../../assets/down.svg";
import { ReactComponent as Display } from "../../assets/Display.svg";
import backlog from "../../assets/Backlog.svg";
import done from "../../assets/Done.svg";
import inprogress from "../../assets/in-progress.svg";
import todo from "../../assets/To-do.svg";
import cancelled from "../../assets/Cancelled.svg";
import menu from "../../assets/3 dot menu.svg";
import add from "../../assets/add.svg";
import Card from "../card/card";

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [grouping, setGrouping] = useState(
    localStorage.getItem("grouping") || "Status"
  );
  const [ordering, setOrdering] = useState(
    localStorage.getItem("ordering") || "Priority"
  );
  const [data, setData] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

const dropdownRef = useRef(null); // For handling outside click


// Close dropdown when clicking outside
useEffect(() => {
  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        if (!response.ok) {
          throw new Error("Error fetching the data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("grouping", grouping);
    localStorage.setItem("ordering", ordering);
  }, [grouping, ordering]);

  const Status = [
    { id: "backlog", title: "Backlog", icon: backlog },
    { id: "done", title: "Done", icon: done },
    { id: "inprogress", title: "In Progress", icon: inprogress },
    { id: "todo", title: "To Do", icon: todo },
    { id: "cancelled", title: "Cancelled", icon: cancelled },
  ];

  const groupByStatus = () => {
    return Status.map((status) => (
      <div className="group-content" id={status.id} key={status.id}>
        <div className="group-title">
          <div className="heading">
            <img src={status.icon} alt={status.title} />
            <span>{status.title}</span>
          </div>
          <div className="heading">
            <img src={add} alt="add" />
            <img src={menu} alt="menu" />
          </div>
        </div>
        {data?.tickets
          .filter((ticket) => ticket.status === status.title)
          .sort((a, b) =>
            ordering === "Priority"
              ? b.priority - a.priority
              : a.title.localeCompare(b.title)
          )
          .map((ticket) => (
            <Card
              key={ticket.id}
              title={ticket.title}
              content={ticket.description}
              priorityLevel={ticket.priority}
            />
          ))}
      </div>
    ));
  };

  const groupByUser = () => {
    const users = [...new Set(data?.tickets.map((ticket) => ticket.user))];
    return users.map((user) => (
      <div className="group-content" id={user} key={user}>
        <div className="group-title">
          <div className="heading">
            <span>{user}</span>
          </div>
        </div>
        {data?.tickets
          .filter((ticket) => ticket.user === user)
          .sort((a, b) =>
            ordering === "Priority"
              ? b.priority - a.priority
              : a.title.localeCompare(b.title)
          )
          .map((ticket) => (
            <Card
              key={ticket.id}
              title={ticket.title}
              content={ticket.description}
              priorityLevel={ticket.priority}
            />
          ))}
      </div>
    ));
  };

  const groupByPriority = () => {
    const priorities = [4, 3, 2, 1, 0];
    return priorities.map((priority) => (
      <div className="group-content" id={`priority-${priority}`} key={priority}>
        <div className="group-title">
          <div className="heading">
            <span>
              {priority === 4
                ? "Urgent"
                : priority === 3
                ? "High"
                : priority === 2
                ? "Medium"
                : priority === 1
                ? "Low"
                : "No Priority"}
            </span>
          </div>
        </div>
        {data?.tickets
          .filter((ticket) => ticket.priority === priority)
          .sort((a, b) =>
            ordering === "Priority"
              ? b.priority - a.priority
              : a.title.localeCompare(b.title)
          )
          .map((ticket) => (
            <Card
              key={ticket.id}
              title={ticket.title}
              content={ticket.description}
              priorityLevel={ticket.priority}
            />
          ))}
      </div>
    ));
  };

  return (
    <>
      <div className="header-container">
        <div className="header-content">
          <div className="display-content">
            <button onClick={toggleDropdown} className="btn">
              <Display />
              <span>Display</span>
              <Down />
            </button>

            {isOpen && (
              <div className="groups">
                <div className="grp-content">
                  <div className="title">Grouping</div>
                  <select
                    value={grouping}
                    onChange={(e) => setGrouping(e.target.value)}
                    className="select"
                  >
                    <option value="Status">Status</option>
                    <option value="Priority">Priority</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="grp-content">
                  <div className="title">Ordering</div>
                  <select
                    value={ordering}
                    onChange={(e) => setOrdering(e.target.value)}
                    className="select"
                  >
                    <option value="Priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hero-container">
        {grouping === "Status"
          ? groupByStatus()
          : grouping === "Priority"
          ? groupByPriority()
          : grouping === "User"
          ? groupByUser()
          : null}
      </div>
    </>
  );
}

export default HomePage;
