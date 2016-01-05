

declare module LoopBack {

	export interface LoopBackApplication {
		models: {
			User?: User;
		}

		/**
		 *

		 Register a connector.

		 When a new data-source is being added via app.dataSource, the connector name is looked up in the registered connectors first.

		 Connectors are required to be explicitly registered only for applications using browserify, because browserify does not support dynamic require, which is used by LoopBack to automatically load the connector module.

		 * @param name
		 * @param connector
		 */
		connector(name: string, connector: Object);

		/**
		 * Define a DataSource.
		 * @param name
		 * @param config
		 */
		dataSource(name: string, config: Object);

		/**
		 * Enable app wide authentication
		 */
		enableAuth();

		/**
		 * Listen for connections and update the configured port.

		 When there are no parameters or there is only one callback parameter, the server will listen on app.get('host') and app.get('port').
		 * @param cb
		 */
		listen(cb: (result) => void);

		/**
		 * Attach a model to the app. The Model will be available on the app.models object.
		 * @param Model
		 * @param config
		 */
		model(Model, config);

		/**
		 * Get all remote objects.
		 */
		remoteObjects();

		/**
		 * Lazily load a set of remote objects.
		 */
		remotes();

		/**
		 * Register a middleware using a factory function and a JSON config.
		 * @param factory
		 * @param config
		 */
		middlewareFromConfig(factory, config);

		/**
		 * Register (new) middleware phases.

		 If all names are new, then the phases are added just before "routes" phase. Otherwise the provided list of names is merged with the existing phases in such way that the order of phases is preserved.
		 * @param nameOrArray
		 */
		defineMiddlewarePhases(nameOrArray);

		/**
		 * Register a middleware handler to be executed in a given phase.
		 * @param name
		 * @param handler
		 */
		middleware(name, handler);
	}

	export interface Registry {

		/**
		 * Add the acl entry to the acls
		 * @param acls
		 * @param acl
		 */
		addACL(acls, acl);
	}

	export interface RegistryInstance {

		/**
		 * Attach any model that does not have a dataSource to the default dataSource for the type the Model requests
		 */
		autoAttach();

		/**
		 * Alter an existing Model class.
		 * @param ModelCtor
		 * @param config
		 */
		configureModel(ModelCtor, config);

		/**
		 * Create a data source with passing the provided options to the connector.
		 * @param name
		 * @param options
		 */
		createDataSource(name, options);
	}

	export interface AccessContextInstance {

		/**
		 * Add a principal to the context
		 * @param principalType
		 * @param principalId
		 * @param principalName
		 */
		addPrincipal(principalType, principalId, principalName);

		/**
		 * Get the application id
		 */
		getAppId(): any;

		/**
		 * Get the user id
		 */
		getUserId(): any;

		/**
		 * Check if the access context has authenticated principals
		 */
		isAuthenticated(): boolean;
	}

	export interface Conflict {

	}

	export interface Model {

		modelName: string;

		/**
		 * Check if the given access token can invoke the specified method.
		 * @param token
		 * @param modelId
		 * @param sharedMethod
		 * @param ctx
		 * @param callback
		 */
		checkAccess(token, modelId: any, sharedMethod, ctx: Object, callback: (err, allowed: boolean) => void);

		/**
		 *
		 * @param name
		 * @param isStatic
		 */
		disableRemoteMethod(name: string, isStatic: boolean);

		/**
		 *
		 * @param callback
		 */
		getApp(callback: (err, app: LoopBackApplication) => void);

		/**
		 *
		 * @param relationName
		 * @param pathName
		 * @param filterMethod
		 * @param paramName
		 * @param getterName
		 * @param hooks
		 * @param filterCallback
		 */
		nestRemoting(relationName: string, pathName: string, filterMethod: string, paramName: string, getterName: string, hooks: boolean, filterCallback: (sharedMethod: Object, relationDefinition: Object) => void);
		nestRemoting(relationName: string, options: Object, pathName: string, filterMethod: string, paramName: string, getterName: string, hooks: boolean, filterCallback: (sharedMethod: Object, relationDefinition: Object) => void);

		/**
		 *
		 * @param name
		 * @param options
		 */
		remoteMethod(name: string, options: Object);

		/**
		 *
		 */
		setup();
	}

	export interface PersistedModel extends Model {

		/**
		 * Apply an update list.
		 * @param updates
		 * @param callback
		 */
		bulkUpdate(updates: any[], callback: Function);

		/**
		 * Get the changes to a model since the specified checkpoint. Provide a filter object to reduce the number of results returned.
		 * @param since
		 * @param filter
		 * @param callback
		 */
		changes(since: number, filter: Object, callback: (err, changes: any[]) => void);

		/**
		 * Create a checkpoint.
		 * @param callback
		 */
		checkpoint(callback: Function);

		/**
		 * Return the number of records that match the optional "where" filter.
		 * @param where
		 * @param callback
		 */
		count(where: Object, callback: (err, count: number) => void);
		count(callback: (err, count: number) => void);

		/**
		 * Create new instance of Model, and save to database.
		 * @param data
		 * @param callback
		 */
		create(data: Object, callback: (err, models: Object) => void);

		/**
		 * Create a change stream. See here for more info
		 * https://docs.strongloop.com/display/public/LB/Realtime+server-sent+events
		 * @param options
		 * @param callback
		 */
		createChangeStream(options: Object, callback: Function);

		/**
		 * Create an update list (for Model.bulkUpdate()) from a delta list (result of Change.diff()).
		 * @param deltas
		 * @param callback
		 */
		createUpdates(deltas: any[], callback: Function);

		/**
		 * Get the current checkpoint ID.
		 * @param callback
		 */
		currentCheckpoint(callback: (err, currentCheckpointId: Number) => void);

		/**
		 * Destroy all model instances that match the optional where specification.
		 * @param where
		 * @param callback
		 */
		destroyAll(where: Object, callback: (err, info: Object) => void);
		destroyAll(callback);

		/**
		 * Destroy model instance with the specified ID.
		 * @param id
		 * @param callback
		 */
		destroyById(id: any, callback: (err) => void);

		/**
		 * Get a set of deltas and conflicts since the given checkpoint.
		 * See Change.diff() for details.
		 * @param since
		 * @param remoteChanges
		 * @param callback
		 */
		diff(since: number, remoteChanges: any[], callback: (err, result) => void);

		/**
		 * Enable the tracking of changes made to the model. Usually for replication.
		 */
		enableChangeTracking();

		/**
		 * Check whether a model instance exists in database.
		 * @param id
		 * @param callback
		 */
		exists(id: any, callback: (err, exists: boolean) => void);

		/**
		 * Find all model instances that match filter specification. See Querying models.
		 * https://docs.strongloop.com/display/public/LB/Querying+data
		 * @param filter
		 * @param callback
		 */
		find(filter: Object, callback: (err, models: any[]) => void);
		find(callback: (err, models: any[]) => void);

		/**
		 * Find object by ID with an optional filter for include/fields.
		 * @param id
		 * @param filter
		 * @param callback
		 */
		findById(id: any, filter: Object, callback: (err, instance: Object) => void);
		findById(id: any, callback: (err, instance: Object) => void);

		/**
		 * Find one model instance that matches filter specification. Same as find, but limited to one result; Returns object, not collection.
		 * @param filter
		 * @param callback
		 */
		findOne(filter: Object, callback: (err, models: any[]) => void);

		/**
		 * Find one record matching the optional where filter.
		 * The same as find, but limited to one object.
		 * Returns an object, not collection.
		 * If not found, create the object using data provided as second argument.
		 * @param where
		 * @param data
		 * @param callback
		 */
		findOrCreate(where: Object, data: Object, callback: (err, instance: Object) => void);

		/**
		 * Get the Change model. Throws an error if the change model is not correctly setup.
		 */
		getChangeModel();

		/**
		 * Get the id property name of the constructor.
		 */
		getIdName();

		/**
		 * Get the source identifier for this model or dataSource.
		 * @param callback
		 */
		getSourceId(callback: (err, sourceId: string) => void);

		/**
		 * Handle a change error. Override this method in a subclassing model to customize change error handling.
		 * @param err
		 */
		handleChangeError(err);

		/**
		 * Specify that a change to the model with the given ID has occurred.
		 * @param id
		 * @param callback
		 */
		rectifyChange(id: any, callback: (err) => void);

		/**
		 * Replicate changes since the given checkpoint to the given target model.
		 * @param since
		 * @param targetModel
		 * @param options
		 * @param callback
		 */
		replicate(since: number, targetModel: Model, options: Object, callback: (err, conflicts: Conflict[], checkpoints: Object[]) => void);

		/**
		 * Update multiple instances that match the where clause.
		 * @param where
		 * @param data
		 * @param callback
		 */
		updateAll(where: Object, data: Object, callback: (err, info: Object) => void);

		/**
		 * Update or insert a model instance
		 * @param data
		 * @param callback
		 */
		upsert(data: Object, callback: (err, model: Object) => void);
	}

	export interface PersistedModelInstance {

		/**
		 * Deletes the model from persistence. Triggers destroy hook (async) before and after destroying object.
		 * @param callback
		 */
		destroy(callback: Function);

		/**
		 * Get the id value for the PersistedModel.
		 */
		getId(): any;

		/**
		 * Get the id property name of the constructor.
		 */
		getIdName(): string;

		/**
		 * Determine if the data model is new.
		 */
		isNewRecord(): boolean;

		/**
		 * Reload object from persistence. Requires id member of object to be able to call find.
		 * @param callback
		 */
		reload(callback: (err, instance: Object) => void);

		/**
		 * Save model instance. If the instance doesn't have an ID, then calls create instead.
		 * Triggers: validate, save, update, or create.
		 * @param options
		 * @param callback
		 */
		save(options: Object, callback: (err, instance: Object) => void);
		save(callback: (err, instance: Object) => void);

		/**
		 * Set the correct id property for the PersistedModel.
		 * Uses the setId method if the model is attached to connector that defines it.
		 * Otherwise, uses the default lookup. Override this method to handle complex IDs.
		 * @param val
		 */
		setId(val: any);

		/**
		 * Update a single attribute. Equivalent to updateAttributes({name: 'value'}, cb)
		 * @param name
		 * @param value
		 * @param callback
		 */
		updateAttribute(name: string, value: any, callback: (err, instance: Object) => void);

		/**
		 * Update set of attributes. Performs validation before updating.
		 * Triggers: validation, save and update hooks
		 * @param data
		 * @param callback
		 */
		updateAttributes(data: Object, callback: (err, instance: Object) => void);
	}

	export interface User extends PersistedModel {
		/**
		 * Confirm the user's identity.
		 * @param userId
		 * @param token
		 * @param redirect
		 * @param cb
		 */
		confirm(userId: any, token: string, redirect: string, cb: Function);

		/**
		 * A default verification token generator which accepts the user
		 * the token is being generated for and a callback function to indicate completion.
		 * This one uses the crypto library and 64 random bytes (converted to hex) for the token.
		 * When used in combination with the user.verify() method
		 * this function will be called with the user object as it's context (this).
		 * @param user
		 * @param cb
		 */
		generateVerificationToken(user: Object, cb: Function);

		/**
		 * Login a user by with the given credentials.
		 * @param credentials
		 * @param cb
		 */
		login(credentials: Object, cb: Function);

		/**
		 * Logout a user with the given accessToken id.
		 * @param accessTokenID
		 * @param callback
		 */
		logout(accessTokenID: string, callback: Function);

		/**
		 * Normalize the credentials
		 * @param credentials
		 * @param realmRequired
		 * @param realmDelimiter
		 */
		normalizeCredentials(credentials: Object, realmRequired: boolean, realmDelimiter: string): Object;

		/**
		 * Create a short lived acess token for temporary login.
		 * Allows users to change passwords if forgotten.
		 * @param options
		 * @param callback
		 */
		resetPassword(options: Object, callback: Function);

	}

	export interface UserInstance extends PersistedModelInstance {
		username: string;
		password: string;
		email: string;
		emailVerified: boolean;
		verificationToken: string;
		realm: string;
		created: Date;
		lastUpdated: Date;
		status: string;

		/**
		 * Create access token for the logged in user.
		 * This method can be overridden to customize how access tokens are generated
		 * @param ttl
		 * @param cb
		 */
		createAccessToken(ttl: number, cb: (err, token) => void);

		/**
		 * Compare the given password with the users hashed password.
		 * @param password
		 */
		hasPassword(password: string): boolean;

		/**
		 * Verify a user's identity by sending them a confirmation email.
		 * @param options
		 */
		verify(options: Object);

	}

}

declare module "loopback" {
	function l(): LoopBack.LoopBackApplication;

	module l {

		/**
		 * Version of LoopBack framework. Static read-only property.
		 */
		export var version: string;

		export var mime: string;

		export var isBrowser: boolean;

		export var isServer: boolean;

		export var registry: LoopBack.Registry;

		export var faviconFile: string;

		/**
		 * Attach any model that does not have a dataSource to the default dataSource for the type the Model requests
		 */
		export function autoAttach();

		/**
		 * Alter an existing Model class.
		 * @param ModelCtor
		 * @param config
		 */
		export function configureModel(ModelCtor, config);

		/**
		 * Create a data source with passing the provided options to the connector.
		 * @param name
		 * @param options
		 */
		export function createDataSource(name, options);

		/**
		 * Create a named vanilla JavaScript class constructor with an attached set of properties and options.
		 *
		 * @param name
		 * @param properties
		 * @param options
		 */
		export function createModel(name, properties, options);

		/**
		 * Create a named vanilla JavaScript class constructor with an attached set of properties and options.
		 * @param config
		 */
		export function createModel(config);

		/**
		 * Look up a model class by name from all models created by loopback.createModel()
		 * @param modelName
		 */
		export function findModel(modelName);

		/**
		 * Get the default dataSource for a given type.
		 * @param type
		 */
		export function getDefaultDataSourceForType(type);

		/**
		 * Look up a model class by name from all models created by loopback.createModel().
		 * Throw an error when no such model exists.
		 * @param modelName
		 */
		export function getModel(modelName: string): LoopBack.Model;

		/**
		 * Look up a model class by the base model class. The method can be used by LoopBack to find configured models in models.json over the base model.
		 * @param modelType
		 */
		export function getModelByType(modelType): LoopBack.Model;

		/**
		 * Get an in-memory data source. Use one if it already exists.
		 * @param name
		 */
		export function memory(name);

		/**
		 * Add a remote method to a model.
		 * @param fn
		 * @param options
		 */
		export function remoteMethod(fn, options);

		/**
		 * Set the default dataSource for a given type.
		 * @param type
		 * @param dataSource
		 */
		export function setDefaultDataSourceForType(type, dataSource);

		/**
		 * Create a template helper.
		 * @param path
		 */
		export function template(path: string);

		/**
		 * Get the current context object. The context is preserved across async calls, it behaves like a thread-local storage.
		 */
		export function getCurrentContext(): LoopBack.AccessContextInstance;

		/**
		 * Run the given function in such way that loopback.getCurrentContext returns the provided context object.
		 * @param fn
		 * @param context
		 */
		export function runInContext(fn, context);

		/**
		 * Create a new LoopBackContext instance that can be used for loopback.runInContext.
		 * @param scopeName
		 */
		export function createContext(scopeName);
	}


	export = l;
}
