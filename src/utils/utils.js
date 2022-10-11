const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const axios = require("axios");

const getUser = async (token, db) => {
    if (!token) return null;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenData?.id) return null;
    return await db.collection("Users").findOne({ _id: ObjectId(tokenData.id) });
}

const getToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "60 days" });

const getLCProfile = async (username) => {
    const data = JSON.stringify(
        {
            query:
                `query($username: String!)
                { matchedUser(username: $username) {
                    username
                    submissionCalendar
                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                }
            }`,
            variables: { "username": username }
        });

    const options = {
        method: "post",
        url: "https://leetcode.com/graphql",
        headers: {
            'Content-Type': 'application/json',
        },
        data: data
    };

    let result;

    await axios(options).then(async (response) => {
        const res = await response.data.data.matchedUser; // Response received from the API

        const submissions = await res.submitStats.acSubmissionNum; // {difficult, count, submissions}

        result = {
            username: res.username,
            submissionCalendar: res.submissionCalendar, // need to parse object <timestamp, questionNumber>
            submitStats: submissions
        }
    }).catch(function (error) {
        console.error(error);
    });
    return result;
}

module.exports = { getUser, getToken, getLCProfile };