import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Preloader from "./PreLoader";
import { REACT_APP_FOOTBALL_API_KEY } from "../settings";
import { Table, Tag, Flex, Layout, Breadcrumb, DatePicker } from "antd";
import MyHeader from "./Header";
import "./LeaguesList.css";

const TeamDetailPage = () => {
  const { teamId } = useParams();
  const [matches, setMatches] = useState([]);
  const [dates, setDates] = useState([null, null]);
  const startDate = useState(null);
  const endDate = useState(null);
  const [loading, setLoading] = useState(true);
  const { Footer, Content } = Layout;
  const [title, setTitle] = useState(" ");
  const { RangePicker } = DatePicker;

  //обработка выбора дат в фильтре
  const handleFilterDates = (range) => {
    setDates(range);
  };

   const fetchMatches = async () => {
    setLoading(true);
    console.log("выбранные даты:", startDate, endDate);
    //подстановка дат из фильтра в параметры запроса только в случае выбора дат пользователем
    const params = {};
   if (dates[0] && dates[1]) {
    params.dateFrom = dates[0].format('YYYY-MM-DD');
    params.dateTo = dates[1].format('YYYY-MM-DD');
  }
    try {
      //запрос для получения названия команды
      const teamInfoResponse = await axios.get(
        `http://localhost:8080/v4/teams/${teamId}`,
        { headers: { "X-Auth-Token": REACT_APP_FOOTBALL_API_KEY } }
      );

      //запрос для получения матчей команды
      const matchesResponse = await axios.get(
        `http://localhost:8080//v4/teams/${teamId}/matches/`,
        {
          headers: { "X-Auth-Token": REACT_APP_FOOTBALL_API_KEY },
          params: params,
        }
      );
      console.log("ответ API:", matchesResponse.data);

      //форматирование даты
      const formatDate = (dateString) => {
        const [date] = dateString.split("T"); //Используем только первую часть до 'T'
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
      };
      //форматирование времени
      const formatTime = (timeString) => {
        const [date, time] = timeString.split("T"); // Отбрасываем часть с Z
        const [hours, minutes] = time.split(":"); // Оставляем только часы и минуты
        return `${hours}:${minutes}`;
      };

      const matchData = matchesResponse.data.matches.map((match) => ({
        key: match.id,
        date: match.utcDate ? formatDate(match.utcDate) : null,
        time: match.utcDate ? formatTime(match.utcDate) : null,
        state: match.status,
        tags: [match.status],
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        score: {
          fullTime:
            match.score.fullTime.homeTeam !== null &&
            match.score.fullTime.awayTeam !== null
              ? `${match.score.fullTime.home} - ${match.score.fullTime.away}`
              : "N/A",
          halfTime:
            match.score.halfTime &&
            match.score.halfTime.home !== null &&
            match.score.halfTime.away !== null
              ? `${match.score.halfTime.home} - ${match.score.halfTime.away}`
              : "N/A",
        },
        homeTeamId: match.homeTeam.id,
        awayTeamId: match.awayTeam.id,
      }));
      console.log("Данные массива для таблицы:", matchData);
      if (
        matchesResponse.data.matches &&
        matchesResponse.data.matches.length > 0
      ) {
        setTitle(teamInfoResponse.data.name);
      }
      setMatches(matchData);
    } catch (err) {
      console.error("Error fetching matches", err);
    } finally {
      setLoading(false); // выключаем индикатор загрузки в любом случае
    }
  };
  useEffect(() => {
    if (teamId) {
      fetchMatches();
    }
  }, [teamId]);

  useEffect(() => {
    if (dates[0] && dates[1]) {
      fetchMatches();
    }
  }, [dates]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "tags",
      key: "state",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color;
            if (tag === "SCHEDULED" || tag === "CANCELLED") {
              color = "gray";
            } else if (tag === "LIVE" || tag === " IN_PLAY") {
              color = "volcano";
            } else if (
              tag === "PAUSED" ||
              tag === "POSTPONED" ||
              tag === "SUSPENDED"
            ) {
              color = "geekblue";
            } else if (tag === "FINISHED") {
              color = "green";
            } else {
              color = "gray";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "HomeTeam",
      dataIndex: "homeTeam",
      key: "homeTeam",
      render: (text, record) => (
        <Link to={`/team/${record.homeTeamId}`}>{text}</Link>
      ),
    },
    {
      title: "AwayTeam",
      dataIndex: "awayTeam",
      key: "awayTeam",
      render: (text, record) => (
        <Link to={`/team/${record.awayTeamId}`}>{text}</Link>
      ),
    },
    {
      title: "Score",
      render: (record) => (
        <>
          {record.score.fullTime && (
            <div>Full Time: {record.score.fullTime}</div>
          )}
          {record.score.halfTime && record.score.halfTime !== " " && (
            <div>Half Time: {record.score.halfTime}</div>
          )}
        </>
      ),
      key: "score",
    },
  ];

  return (
    <Flex gap="middle" wrap>
      <Layout>
        <MyHeader />
        <Content className="contentStyle">
          {loading ? (
            <Preloader />
          ) : (
            <>
              <Breadcrumb className="breadStyle">
                <Breadcrumb.Item>
                  <Link to="/teams">Teams</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Team {title}</Breadcrumb.Item>
              </Breadcrumb>
              <h1>Calendar {title}</h1>
              <RangePicker 
              value={dates}
              onChange={handleFilterDates} />
              <Table
                className="tableStyle"
                columns={columns}
                dataSource={matches}
              />
            </>
          )}
        </Content>
        <Footer className="footerStyle">Коннова Дарья, 2024</Footer>
      </Layout>
    </Flex>
  );
};
export default TeamDetailPage;
