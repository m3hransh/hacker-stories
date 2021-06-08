import React from "react";
import styles from "./style.module.css";
import buttonStyles from "../App.module.css";
import { ReactComponent as Check } from "./check.svg";
import { ReactComponent as SortAsc } from "./sort-ascending.svg";
import { ReactComponent as SortDesc } from "./sort-descending.svg";
import { ListProps, ItemProps } from "./types";
import { Story } from "../types";
import { sortBy } from "lodash";
// This used with the useCall back to
// Prevent rerendering when the App renders
const SORTS = {
  NONE: (list: Array<any>) => list,
  TITLE: (list: Array<any>) => sortBy(list, "title"),
  AUTHOR: (list: Array<any>) => sortBy(list, "author"),
  COMMENT: (list: Array<any>) => sortBy(list, "num_comments").reverse(),
  POINT: (list: Array<any>) => sortBy(list, "points").reverse(),
};

type SortKey = "TITLE" | "AUTHOR" | "COMMENT" | "POINT" | "NONE";

const List = ({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = React.useState<{sortKey:SortKey, isReversed:boolean}>({sortKey: "NONE", isReversed: false});

  const handleSort = (sortKey: SortKey) => {
    const isReversed = (sortKey === sort.sortKey) && !sort.isReversed;

    setSort({sortKey, isReversed});
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReversed 
    ? sortFunction(list).reverse()
    : sortFunction(list);
  

  return (
    <>
      <div style={{ display: "flex" }}>
        <span style={{ width: "40%" }}>
          <button
            style={{
              background: sort.sortKey === "TITLE" ? "gray" : "white",
            }}
            type="button"
            onClick={() => handleSort("TITLE")}
          >
            Title 
            {(sort.sortKey ==='TITLE' && sort.isReversed )
              ? <SortAsc height="15px" width="15px" />
              : <SortDesc height="15px" width="15px"/>
              }
          </button>
        </span>
        <span style={{ width: "30%" }}>
          <button
            style={{
              background: sort.sortKey === "AUTHOR" ? "gray" : "white",
            }}
            type="button"
            onClick={() => handleSort("AUTHOR")}
          >
            Author
            {(sort.sortKey ==='AUTHOR' && sort.isReversed )
              ? <SortAsc height="15px" width="15px" />
              : <SortDesc height="15px" width="15px"/>
              }
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button
            style={{
              background: sort.sortKey === "COMMENT" ? "gray" : "white",
            }}
            type="button"
            onClick={() => handleSort("COMMENT")}
          >
            Comment 
            {(sort.sortKey ==='COMMENT' && sort.isReversed )
              ? <SortAsc height="15px" width="15px" />
              : <SortDesc height="15px" width="15px"/>
              }
          </button>
        </span>
        <span style={{ width: "10%" }}>
          <button
            style={{
              background: sort.sortKey === "POINT" ? "gray" : "white",
            }}
            type="button"
            onClick={() => handleSort("POINT")}
          >
            Point 
            {(sort.sortKey ==='POINT' && sort.isReversed )
              ? <SortAsc height="15px" width="15px" />
              : <SortDesc height="15px" width="15px"/>
              }
          </button>
        </span>
        <span style={{ width: "10%" }}>Actions</span>
      </div>
      {sortedList.map((item: Story) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </>
  );
};

const Item = ({ item, onRemoveItem }: ItemProps) => {
  return (
    <div className={styles.item}>
      <span style={{ width: "40%" }}>
        <a href={item.url}>{item.title} </a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}>{item.num_comments}</span>
      <span style={{ width: "10%" }}>{item.points}</span>
      <span style={{ width: "10%" }}>
        <button
          type="button"
          onClick={() => {
            onRemoveItem(item);
          }}
          className={`${buttonStyles.button} ${buttonStyles.buttonSmall}`}
        >
          <Check height="18px" width="18px" />
        </button>
      </span>
    </div>
  );
};
export { Item };
export default List;
