maxQs = 13
COLORS = { maroon: "#cd5d7d", red: "#fb8072", orange: "#fdb462", yellow: "#ffffb3", green: "#7bf1a8", mint: "#60d394", aqua: "#8dd3c7", blue: "#80b1d3", cyan: "#9bf6ff", purple: "#bdb2ff", royal: "#9381ff", pink: "#ffc6ff", black: "#000000", grey: "#888888", white: "#dddddd" }
ID2C = { "nota": "black", "idc": "grey", "auth": "orange", "olig": "maroon", "strato": "purple", "cent": "white", "dir": "mint", "dir*": "cyan", "rep": "pink", "repr": "pink", "rep*": "red", "repr*": "red", "cons": "aqua", "min": "yellow", "cont": "blue", "moder": "aqua", "just": "pink", "obs": "green", "free": "yellow", "retrib": "maroon", "retribu": "maroon", "det": "blue", "warn": "green", "rehab": "pink", "decn": "yellow", "iso": "orange", "sov": "blue", "pop": "maroon", "pop*": "royal", "friend": "pink", "friend*": "cyan" }

//create boxes statically once so call stack doesn't grow infinitely every time you click something
function renderFormat() {
    quizAnswers = [];

    for (var i = 0; i < maxQs; i++) {
        quizAnswers.push(createQuizAnswer().datum(i).on("click", d => {
            if (ANSWERS[d] == "prev") previous(d)
            else Answers[questionindex] = d; //renderQuestion(d)
            d3.selectAll(".quiz__answer").classed("is-expanded", false);
            d3.select(quizAnswers[d].node().parentNode).classed("is-expanded", true);
        }))
    }
}

function renderQuestion(selected) {
    Selected = selected
    QUESTION = Qs[questionindex].key
    ANSWERS = []

    for (var i = 0; i < Qs[questionindex].order.length; i++) {
        ANSWERS.push(QUESTION + Qs[questionindex].order[i]);
    }

    ANSWERS.push("o")
    ANSWERS.push("a")
    OMIT_N = 2

    if (questionindex > 0) {
        ANSWERS.push("prev")
        OMIT_N = 3
    }

    d3.select(".wikicharts__title").text((LANGUAGES[QUESTION] || ({ curlang: "ERROR" }))[curlang]);

    d3.select(".wikicharts__footer-count-number--current").text(questionindex + 1);
    d3.select(".wikicharts__footer-count-number--all").text(Qs.length);
    d3.select(".wikicharts__footer-progress-bar").attr("max", Qs.length).attr("value", questionindex + 1);

    SIZE = 1000
    Q = []

    d3.selectAll(".quiz__answer .buttons-container").remove();
    d3.selectAll(".quiz__answer.is-visible").classed("is-visible", false).classed("is-expanded", false).select(".quiz__answer-button").classed("previous", false).classed("not-agree", false).classed("not-interested", false);

    for (var i = 0; i < ANSWERS.length; i++) {
        // Y = (Boxheight + Boxpadding) * i + Questionsize + 2 * Questionpadding
        // bounds = [100, Y, 800, Boxheight]
        // T = createText(bounds, ANSWERS[i], bounds[3])
        // SIZE = Math.min(SIZE, T[1])
        // Q.push(T[0])
        // Backgrounds[i].attr('fill', i == selected ? '#5081a3' : '#80b1d3')

        d3.select(quizAnswers[i].node().parentNode).classed("is-visible", true);
        quizAnswers[i].text((LANGUAGES[ANSWERS[i]] || ({ curlang: "ERROR" }))[curlang]);

        if (ANSWERS[i] == "prev") {
            quizAnswers[i].classed("previous", true);
        } else if (ANSWERS[i] == "o") {
            quizAnswers[i].classed("not-agree", true);

            let buttonsContainer = d3.select(quizAnswers[i].node().parentNode).append("div").classed("buttons-container", true);
            
            buttonsContainer.append("button").classed("buttons-container__button rightbox", true).text("Предпочтение определённо").on("click", d => {
                (Selected < ANSWERS.length - OMIT_N) ? next(1.5) : next(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        } else if (ANSWERS[i] == "a") {
            quizAnswers[i].classed("not-interested", true);

            let buttonsContainer = d3.select(quizAnswers[i].node().parentNode).append("div").classed("buttons-container", true);

            buttonsContainer.append("button").classed("buttons-container__button rightbox", true).text("Предпочтение определённо").on("click", d => {
                (Selected < ANSWERS.length - OMIT_N) ? next(1.5) : next(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        } else {
            let buttonsContainer = d3.select(quizAnswers[i].node().parentNode).append("div").classed("buttons-container", true);

            buttonsContainer.append("button").classed("buttons-container__button leftbox", true).text("Предпочтение незначительно").on("click", (d) => {
                next(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
            buttonsContainer.append("button").classed("buttons-container__button rightbox", true).text("Предпочтение определённо").on("click", d => {
                (Selected < ANSWERS.length - OMIT_N) ? next(1.5) : next(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        // if (i == selected) {
        //     if (i < ANSWERS.length - OMIT_N) {
        //         bl = [100, Y, Boxheight, Boxheight]
        //         leftbox.attr('y', Y)
        //         createLineText(bl, "?")
        //         // leftcbox.attr('y', Y)

        //     }
        //     br = [900 - Boxheight, Y, Boxheight, Boxheight]
        //     rightbox.attr('y', Y)
        //     createLineText(br, "✓")
        //     // rightcbox.attr('y', Y)
        // }
    }

    // if (questionindex == 0) {
    //     H = svg.attr('height') - 80
    //     W = 50 * H / 1056
    //     W2 = W * 0.8
    //     CW = 100 - W - W2 / 2
    //     CH = 80 + H / 2

    //     if (selected >= 0) {
    //         createLineText([CW - H / 2, CH - W2 / 2, H, W2], LANGUAGES["BL"][curlang]).attr("transform", "rotate(-90," + CW + "," + CH + ")").attr('fill', 'lightgrey')
    //         svg.append("image").attr("href", "data/left.png").attr('x', 100 - W).attr('y', 80).attr('width', W).attr('height', H)
    //         createLineText([1000 - (CW + H / 2), CH - W2 / 2, H, W2], LANGUAGES["BR"][curlang]).attr("transform", "rotate(90," + (1000 - CW) + "," + CH + ")").attr('fill', 'lightgrey')
    //         svg.append("image").attr("href", "data/right.png").attr('x', 900).attr('y', 80).attr('width', W).attr('height', H)
    //     } else {
    //         //bounds: [10,80,85-W,80,H]
    //         createLineText([CW - H / 2, CH - W2 / 2, H, W2], LANGUAGES["A"][curlang]).attr("transform", "rotate(-90," + CW + "," + CH + ")").attr('fill', 'lightgrey')
    //         svg.append("image").attr("href", "data/left.png").attr('x', 100 - W).attr('y', 80).attr('width', W).attr('height', H)
    //     }
    // }

    for (i = 0; i < Q.length; i++)
        for (j = 0; j < Q[i].length; j++)
            Q[i][j].attr("font-size", SIZE)
}

function renderChart(box, result) {
    pct = 1000
    for (var i = result.length - 1; i >= 0; i--) {
        createSemicircle(box, pct).attr('fill', COLORS[ID2C[result[i][0]]])
        pct -= result[i][1]
    }
}

function renderInfoBox(box, result) {
    createBox(box).attr('fill', COLORS[ID2C[result[0]]])
    createLineText([box[0] + 10, box[1] + 10, box[2] - ResultPercentWidth + 8, ResultPercentHeight], (result[1] / 10) + "% " + LANGUAGES[result[0]][curlang]).attr('fill', result[0] == "nota" ? "white" : "black")
    createText([box[0] + 10, box[1] + 20 + ResultPercentHeight, box[2] - ResultPercentWidth + 8, box[3] - 30 - ResultPercentHeight], result[0] + "desc", 0, result[0] == "nota" ? "white" : "black")
}

function renderResult(box, result, label) {
    textg = svg
    renderChart([box[0], box[1] + ResultLabelheight, box[3] - ResultLabelheight, box[3] - ResultLabelheight], result)
    createLineText([box[0], box[1] - 10, box[3] - ResultLabelheight, ResultLabelheight], LANGUAGES[label][curlang]).attr("fill", 'white')
    var width = (box[2] - box[3] + ResultLabelheight) / 3
    for (var k = 0; k < result.length; k++)
        renderInfoBox([box[0] + box[3] + Boxpadding + k * width, box[1] + ResultLabelheight, width - Boxpadding, box[3] - ResultLabelheight], result[k])
}
