import "./styles.scss";

interface IPageTitle {
	pageName: string
}

const PageTitle = (props: IPageTitle) => {
  const pageName: string[] = [];

  for (let index = 0; index < props.pageName.length; index++)
    pageName.push(props.pageName.charAt(index));

  const title = pageName.map((x, index) => { return (<h1 key={index}>{x.toUpperCase()}</h1>);});

  return (
    <div className="page-title">
      <div className="page-title-first">
        {title}
      </div>
      <div className="page-title-second">
        {title}
      </div>
      <div className="page-title-third">
        {title}
      </div>
    </div>
  );
};

export default PageTitle;