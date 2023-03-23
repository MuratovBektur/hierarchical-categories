const app = require("express")();
const cors = require("cors");
const { orderBy } = require("lodash");

const categories = require("./categories.json");

const PORT = process.env.PORT ?? 5000;

app.use(
  cors({
    origin: "*",
  })
);

const categoryTitles = [
  "countView",
  "countPlay",
  "countSend",
  "countOrder",
  "countPay",
  "viewSend",
  "viewPay",
];

const sortDirectionList = ["asc", "desc"];

const defaultSortDirection = sortDirectionList[0];

function getPercent(num) {
  return +(num * 100).toFixed(2);
}

function calcCategoriesTotal(categories) {
  const total = {
    countView: 0,
    countPlay: 0,
    countSend: 0,
    countOrder: 0,
    countPay: 0,
    viewSend: 0,
    viewPay: 0,
  };

  for (let category of categories) {
    total.countView += category.countView;
    total.countPlay += category.countPlay;
    total.countSend += category.countSend;
    total.countOrder += category.countOrder;
    total.countPay += category.countPay;
  }

  total.viewSend = getPercent(total.countSend / total.countView);
  total.viewPay = getPercent(total.countPay / total.countView);
  return total;
}

function sortCategories(categories, sortType, sortDirection) {
  categories = JSON.parse(JSON.stringify(categories));
  // если не валидный тип сортировки
  // то берем первый из списка типов сортировки
  if (!categoryTitles.includes(sortType)) {
    sortType = categoryTitles[0];
  }
  // тоже самое с направление сортировки
  if (!sortDirectionList.includes(sortDirection)) {
    sortDirection = defaultSortDirection;
  }
  return orderBy(
    categories,
    [sortType, "title"],
    [sortDirection, defaultSortDirection]
  );
}

app.get("/categories", (req, res) => {
  const { sortType, sortDirection } = req.query;
  const result = {
    categories: sortCategories(categories, sortType, sortDirection),
    total: calcCategoriesTotal(categories),
  };
  return res.json(result);
});

app.listen(PORT, () => console.log(`server runned on PORT: ${PORT}`));
