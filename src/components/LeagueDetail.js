import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Preloader from "./PreLoader";
import { REACT_APP_FOOTBALL_API_KEY } from "../settings";
//import getDateString from './utils';
import { Table, Tag, Flex, Layout, DatePicker } from "antd";
import "./LeaguesList.css";

const LeagueDetailPage = () => {
  const { leagueId } = useParams();
  const [matches, setMatches] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { Header, Footer, Content } = Layout;
  const [title, setTitle] = useState(" ");
  const { RangePicker } = DatePicker;

  const fetchMatches = async () => {
    setLoading(true);
    console.log("выбранные даты:", startDate, endDate);
    const params = {};
    if (startDate) params.dateFrom = startDate;
    if (endDate) params.dateTo = endDate;
    try {
      const response = await axios.get(
        `http://localhost:8080/v4/competitions/${leagueId}/matches/`,
        {
          headers: { "X-Auth-Token": REACT_APP_FOOTBALL_API_KEY },
          params: params,
        }
      );
      console.log("ответ API:", response.data);

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

      const matchData = response.data.matches.map((match) => ({
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
      }));
      console.log("Данные массива для таблицы:", matchData);
      setTitle(response.data.competition.name);
      setMatches(matchData);
    } catch (err) {
      console.error("Error fetching matches", err);
    } finally {
      setLoading(false); // выключаем индикатор загрузки в любом случае
    }
  };
  useEffect(() => {
    if (leagueId) {
      fetchMatches();
    }
  }, [leagueId, startDate, endDate]);

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
      render: (text) => <a>{text}</a>,
    },
    {
      title: "AwayTeam",
      dataIndex: "awayTeam",
      key: "awayTeam",
      render: (text) => <a>{text}</a>,
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

  const handleFilterDates = (values, dateStrings) => {
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
  };

  return (
    <Flex gap="middle" wrap>
      <Layout>
        <Header className="headerStyle">Header</Header>
        <Content className="contentStyle">
          {loading ? (
            <Preloader />
          ) : (
            <>
              <h1>League {title} Matches</h1>
              <RangePicker onChange={handleFilterDates} />
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
export default LeagueDetailPage;
