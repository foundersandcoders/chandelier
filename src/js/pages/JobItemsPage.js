"use strict";
import React, { Component, PropTypes } from "react";
import Table from "../components/common/Table";
import NavBar from "../components/common/NavBar";
import Filter from "../components/common/Filter";
import connectToStores from "../utils/connectToStores";
import SelectionStore from "../stores/SelectionStore";
import ItemsStore from "../stores/ItemsStore";
import * as JobItemsActionCreators from "../actions/JobItemsActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";

function requestDataFromServer() {
	SharedActionCreators.getSelections();
	JobItemsActionCreators.getAllItems();
}

class JobItemsPage extends Component {

	componentWillMount() {
		requestDataFromServer();
	}

	render() {
		return (
			<div>
				<NavBar title="All Items"/>
				<div className="container">
					<Filter filters={this.props.filters} selections={this.props.selections}
						setFilter={SharedActionCreators.setFilter} setStartDate={SharedActionCreators.setStartDate}
						setEndDate={SharedActionCreators.setEndDate}
						restrictTo={SharedActionCreators.restrictTo}
						sortFunc={SharedActionCreators.sortBy}
					/>
					<Table {...this.props} primaryKey={"item_id"}
						onBlur={SharedActionCreators.saveItem.bind(this, this.props.details.job_id)}
						sortFunc={SharedActionCreators.sortBy}
					/>
				{/* <button className="add-button" onClick={SharedActionCreators.createItem.bind(this, null, {})}>+</button> */}
				</div>
			</div>
		);
	}
}

function getState() {
	const items = ItemsStore.getFilteredAndSortedItems();
	const filters = ItemsStore.getFilters();
	const selections = SelectionStore.getSelections();

	return {
		selections,
		items,
		filters
	};
}

export default connectToStores([ItemsStore, SelectionStore], getState)(JobItemsPage);

JobItemsPage.defaultProps = {
	tableScheme: [
		{ key: "-",           display: "",            className: "fixed-col",    type: "button",    onClick:SharedActionCreators.deleteItem,
				inputClassName: "btn-left" },
		{ key: "item_id",     display: "Item",        className: "qty-sm",       type: "" },
		{ key: "product",     display: "Product",     className: "",             type: "text",     onChange: SharedActionCreators.changeItem   },
		{ key: "description", display: "Description", className: "u-flex-grow3", type: "textarea", onChange: SharedActionCreators.changeItem   },
		{ key: "glass",       display: "Glass",       className: "",             type: "text",     onChange: SharedActionCreators.changeItem   },
		{ key: "metal",       display: "Metal",       className: "",             type: "text",     onChange: SharedActionCreators.changeItem   },
		{ key: "flex",        display: "Flex",        className: "",             type: "text",     onChange: SharedActionCreators.changeItem   },
		{ key: "bulb",        display: "Bulb",        className: "",             type: "text",     onChange: SharedActionCreators.changeItem   },
		{ key: "qty_req",     display: "Qty Req",     className: "qty-sm",       type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "qty_hot",     display: "Qty Hot",     className: "qty-sm",       type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "qty_cold",    display: "Qty Cold",    className: "qty-sm",       type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "qty_assem",   display: "Qty Assem",   className: "qty-md",       type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "qty_packed",  display: "Qty Packed",  className: "qty-md",       type: "number",   onChange: SharedActionCreators.changeItem   },
		{ key: "notes",       display: "Notes",       className: "u-flex-grow3", type: "textarea", onChange: SharedActionCreators.changeItem   },
		{ key: "+", 	        display: "",            className: "fixed-col",    type: "button",    onClick: SharedActionCreators.createItem,
				inputClassName: "btn-right"}
	]
};
