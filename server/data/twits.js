const twits = [
  {
    _id: "5a92b7fdcb71600d68a94021",
    user: "5a92b7fdcb71600d68a94013",
    likes: ["5a92b7fdcb71600d68a94013", "5a92b7fdcb71600d68a94014"],
    comments: [
      {user: "5a92b7fdcb71600d68a94013", comment: "I love the technology used"},
      {user: "5a92b7fdcb71600d68a94013", comment: "I have been using them for a while now"},
      {user: "5a92b7fdcb71600d68a94014", comment: "I will recommend them for every business"}
    ],
    twit: "At Jeremi Cloud, we take great pride in tackling complex problems and creating solutions that are innovative and impactful."
  },
  {
    _id: "5a92b7fdcb71600d68a94022",
    user: "5a92b7fdcb71600d68a94014",
    likes: ["5a92b7fdcb71600d68a94013"],
    twit: "To deliver on that promise, we follow best practices in developing applications, e.g. having a well-defined directory structure and driving development via tests."
  },
  {
    _id: "5a92b7fdcb71600d68a94023",
    user: "5a92b7fdcb71600d68a94013",
    likes: ["5a92b7fdcb71600d68a94014"],
    twit: "Please use all the allocated time to craft a solution that you can be proud of and help us evaluate you in the best light."
  },
  {
    _id: "5a92b7fdcb71600d68a94024",
    user: "5a92b7fdcb71600d68a94014",
    likes: [],
    twit: "By accepting this exercise, you agree not to publish or distribute the exercise or any solutions to anyone or to a publicly accessible location such as Github"
  }
];

module.exports = {twits}