import { ISnippet } from '@sap-devx/code-snippet-types';
import * as vscode from 'vscode';
import * as fsextra from "fs-extra";
import { EntityType } from "./enums/EntityType";

interface ContentUri {
	docUri: vscode.Uri,
	outputUri: vscode.Uri
}

export function activate(context: vscode.ExtensionContext) {



	let disposable = vscode.commands.registerCommand('extension.showCodeSnippetContrib', (uri: vscode.Uri) => {
		try {
			vscode.commands.executeCommand("loadCodeSnippet", { contributorId: "SAPOSS.vscode-snippet-contrib", snippetName: "snippet_1", context: { uri: uri } });
		} catch (error) {
			vscode.window.showInformationMessage(error);
		}
	});


	context.subscriptions.push(disposable);

	const api = {
		getCodeSnippets(csContext: any) {
			const snippets = new Map<string, ISnippet>();
			let snippet: ISnippet = {
				getMessages() {
					return {
						title: "SAP graph pages for Vue",
						description: "Provide details for the Vue.js pages you want to create.",
						applyButton: "Create"
					};
				},
				getQuestions() {
					return createCodeSnippetQuestions(context);
				},
				async getWorkspaceEdit(answers: any) {

					const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length ? vscode.workspace.workspaceFolders[0] : undefined;

					if (!workspaceFolder) {
						vscode.window.showErrorMessage("Cannot find folder");
						return;
					}

					const we = new vscode.WorkspaceEdit();

			

					// const packageJSONUri: vscode.Uri = vscode.Uri.parse(`${workspaceFolder.uri.path}/package.json`);
					// add axios to package.json dependencies (if it's not already there)
					// const packageJSONContent = await fsextra.readFile(packageJSONUri.fsPath, "utf-8");
					// const packageJSON = JSON.parse(packageJSONContent);

					// create api.js file
					const apiDocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/template/api.js`);
					const apiFileContent = await fsextra.readFile(apiDocUri.fsPath, "utf-8");
					const apiLocationUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/src/api/index.js`);
					we.createFile(apiLocationUri, {
						overwrite: true,
						ignoreIfExists: false
					});
					we.insert(apiLocationUri, new vscode.Position(0, 0), apiFileContent, { needsConfirmation: true, label: "snippet contributor" });

					// create router.js file 
					const routerDocUri: vscode.Uri = vscode.Uri.parse(`${context.extensionPath}/template/router.js`);
					const routerFileContent = await fsextra.readFile(routerDocUri.fsPath, "utf-8");

					const routerLines = routerFileContent.split("\n");

					// find the line where routes is located
					

					const routerLocationUri = vscode.Uri.parse(`${workspaceFolder.uri.path}/src/router.js`);
					we.createFile(routerLocationUri, {
						overwrite: true,
						ignoreIfExists: false
					});
					we.insert(routerLocationUri, new vscode.Position(0, 0), routerFileContent, { needsConfirmation: true, label: "snippet contributor" });	


					const entityName: EntityType = answers.graphEntityName;

					if (!entityName) {
						return;
					}


					let docsUri: ContentUri[] = [];


					switch (entityName) {
						case EntityType.Customers:
							docsUri.push({
								docUri: vscode.Uri.parse(`${context.extensionPath}/template/Customers.vue`),
								outputUri: vscode.Uri.parse(`${workspaceFolder.uri.path}/src/pages/Customers.vue`)
							});
							break;
						case EntityType.Orders:
							docsUri.push({
								docUri: vscode.Uri.parse(`${context.extensionPath}/template/Orders.vue`),
								outputUri: vscode.Uri.parse(`${workspaceFolder.uri.path}/src/pages/Orders.vue`)
							});

							docsUri.push({
								docUri: vscode.Uri.parse(`${context.extensionPath}/template/ProcessingStatusCell.vue`),
								outputUri: vscode.Uri.parse(`${workspaceFolder.uri.path}/src/components/ProcessingStatusCell.vue`)
							});
							break;
						case EntityType.Items:					
							docsUri.push({
								docUri: vscode.Uri.parse(`${context.extensionPath}/template/OrderItems.vue`),
								outputUri: vscode.Uri.parse(`${workspaceFolder.uri.path}/src/pages/OrderItems.vue`)
							});
							break;
					}


					for (const uriItem of docsUri) {
						const documentContent = await fsextra.readFile(uriItem.docUri.fsPath, "utf-8");
						we.createFile(uriItem.outputUri, {
							overwrite: true, 
							ignoreIfExists: false
						})
						we.insert(uriItem.outputUri, new vscode.Position(0, 0), documentContent, { needsConfirmation: true, label: "snippet contributor" });
					}

					return we;
				}
			}
			snippets.set("snippet_1", snippet);
			return snippets;
		},
	};

	return api;
}

function createCodeSnippetQuestions(context: any): any[] {
	const questions: any[] = [];
	console.log("showing questions");
	questions.push(
		{
			guiOptions: {
				hint: "Select the type of configuration you want to create."
			},
			type: "list",
			name: "graphEntityName",
			message: "Type",
			choices: [
				EntityType.Customers,
				EntityType.Orders,
				EntityType.Items
			]
		},
		{
			guiOptions: {
				hint: "Select the page type ... "
			},
			type: "list",
			name: "pageType",
			message: "Page Type",
			choices: [
				'list',
				'details'
			]
		},
		{
			guiOptions: {
				hint: "Check to add full CRUD support for this page"
			},
			type: "confirm",
			name: "enableCRUD",
			message: "Enable CRUD"
		},
		{
			guiOptions: {
				hint: "Provide the location of your Vue app router in here",
				type: "file-browser",
			},
			type: "input",
			message: "Vue router file location",
			name: "vueRouterFileLocation",
		}
	);

	return questions;
}

export function deactivate() { }
