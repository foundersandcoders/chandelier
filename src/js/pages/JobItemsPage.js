"use strict";
import React, { Component, PropTypes } from "react";
import DocumentTitle from "react-document-title";
import Table from "../components/table/Table";
import Filter from "../components/filter/Filter";
import NavBar from "../components/common/NavBar";
import Alert from "../components/common/Alert";
import connectToStores from "../utils/connectToStores";
import SelectionStore from "../stores/SelectionStore";
import ItemsStore from "../stores/ItemsStore";
import AlertStore from "../stores/AlertStore";
import PaginationStore from "../stores/PaginationStore";
import * as JobItemsActionCreators from "../actions/JobItemsActionCreators";
import * as SharedActionCreators from "../actions/SharedActionCreators";
import { ddMMMyyyy } from "../utils/yyyyMMdd";
import rbPrefixer from "../utils/rbPrefixer";

function requestDataFromServer() {
	SharedActionCreators.getSelections();
	SharedActionCreators.getAllProducts();
	JobItemsActionCreators.getAllItems();
}

class JobItemsPage extends Component {

	componentWillMount() {
		requestDataFromServer();
	}

	componentWillUnmount() {
		SharedActionCreators.changePageNumber(0);
		SharedActionCreators.setRowsPerPage(50);
	}

	render() {
		const shouldDisplayAlert = this.props.isLoading ||
																this.props.isUnsaved ||
																this.props.hasChanged ||
																this.props.alert;

		return (
			<DocumentTitle title="Job Items — R&B">
				<div>
					<NavBar title={"All Items"} >
						{(shouldDisplayAlert) ?
							<Alert isLoading={this.props.isLoading} isUnsaved={this.props.isUnsaved}
								hasChanged={this.props.hasChanged} alert={this.props.alert} /> :
							<span />
						}
						<img src="/img/transparent.gif" className="logo" />
					</NavBar>
					<NavBar routeConfig={this.props.routeScheme}>
						<div className="nav nav-item logout">
							<a href="/logout">Logout</a>
						</div>
					</NavBar>
					<div className="container">
						<Filter filters={this.props.filters} selections={this.props.selections}
							setFilter={JobItemsActionCreators.setFilter}
							setStartDate={JobItemsActionCreators.setStartDate}
							setEndDate={JobItemsActionCreators.setEndDate}
							restrictTo={JobItemsActionCreators.restrictTo}
							presetConfig={this.props.presetScheme}
							currentPage={this.props.currentPage}
							rowsPerPage={this.props.rowsPerPage}
							numberOfRows={this.props.numberOfItems}
							setRowsPerPage={SharedActionCreators.setRowsPerPage}
							changePage={SharedActionCreators.changePageNumber}
						/>
						<div className="table-container">
							<Table selections={this.props.selections}
								filters={this.props.filters}
								items={this.props.items} primaryKey={"item_id"}
								tableScheme={this.props.tableScheme}
								onBlur={SharedActionCreators.saveItem}
								sortFunc={SharedActionCreators.externalSortBy.bind(null, "items")}
							/>
						</div>
					</div>
				</div>
			</DocumentTitle>
		);
	}
}

function getState() {
	const start = PaginationStore.getOffset();
	const rowsPerPage = PaginationStore.getRowsPerPage();
	const end = start + rowsPerPage;

	const items = ItemsStore.getFilteredItems(start, end);
	const filters = ItemsStore.getFilters();
	const currentPage = PaginationStore.getCurrentPage();
	const numberOfItems = ItemsStore.getNumberOfItems();
	const selections = SelectionStore.getSelections();

	const hasChanged = AlertStore.getChangedStatus();
	const isLoading = AlertStore.getLoadStatus();
	const isUnsaved = AlertStore.getUnsavedStatus();
	const alert = AlertStore.getAlert();

	return {
		selections,
		items,
		filters,
		currentPage,
		numberOfItems,
		rowsPerPage,
		hasChanged,
		isLoading,
		isUnsaved,
		alert
	};
}

export default connectToStores([
	ItemsStore, SelectionStore,
	AlertStore, PaginationStore
], getState)(JobItemsPage);

// Code too wide
JobItemsPage.defaultProps = {
	tableScheme: [
		{ key: "job_id",        display: "Job #", otherContent: "pdf", className: "qty-sm link",
					type: "link",     formattingFunc: rbPrefixer, to: "singlejob"},

		{ key: "client",        display: "Client", otherContent: "pdf", className: "",
					type: "" },

		{ key: "product",       display: "Product", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem },

		{ key: "description",   display: "Description", otherContent: "pdf", maxRows: 3,
					className: "u-flex-grow2", type: "textarea", onChange: SharedActionCreators.changeItem },

		{ key: "job_status",    display: "Job Status", otherContent: "pdf", className: "",
					type: ""},

		{ key: "shipping_date", display: "Shipping Date", otherContent: "pdf", className: "",
					type: "",         formattingFunc: ddMMMyyyy  },

		{ key: "qty_req",       display: "Qty", line2: "Req", otherContent: "pdf", className: "qty-sm",
					type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },

		{ key: "qty_hot",       display: "Qty", line2: "Hot", className: "qty-sm",
					type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },

		{ key: "qty_cold",      display: "Qty", line2: "Cold",  className: "qty-sm",
					type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },

		{ key: "qty_assem",     display: "Qty", line2: "Assem", className: "qty-sm",
					type: "number",   onChange: SharedActionCreators.changeItem,   isNum: true },

		{ key: "glass",         display: "Glass", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem                },

		{ key: "metal",         display: "Metal", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem                },

		{ key: "flex",          display: "Flex", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem                },

		{ key: "bulb",          display: "Bulb", otherContent: "pdf", className: "u-flex-grow2",
					type: "select",   onChange: SharedActionCreators.changeItem                },

		{ key: "notes",         display: "Notes", className: "u-flex-grow2", maxRows: 3,
					type: "textarea", onChange: SharedActionCreators.changeItem   }
	],
	presetScheme: [
		{
			description: "Clear All Filters",
			onSelect: [
				JobItemsActionCreators.clearItemsFilters,
				SharedActionCreators.setRowsPerPage.bind(null, 50)
			]
		},
		{
			description: "Within 3 weeks & confirmed",
			onSelect: [
				JobItemsActionCreators.clearItemsFilters,
				JobItemsActionCreators.restrictTo.bind(null, "job_status", ["Confirmed"]),
				JobItemsActionCreators.setStartDate.bind(null, new Date()),
				JobItemsActionCreators.setEndDate.bind(null, new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 3)),
				SharedActionCreators.setRowsPerPage.bind(null, Infinity)
			]
		}
		// {
		// 	description: "Borosilicate",
		// 	onSelect: [
		// 		JobItemsActionCreators.clearItemsFilters,
		// 		JobItemsActionCreators.restrictTo.bind(null, "product",
		// 			["Spindle Pendant 3-Bubble", "Spindle Pendant 4-Bubble", "Tiered Light", "Spindle Shade"]
		// 		)
		// 	]
		// }
	],
	routeScheme: [
		{ display: "Jobs", "to": "jobs" },
		{ display: "Items", "to": "items" },
		{ display: "Products", to: "products"}
	]

};
