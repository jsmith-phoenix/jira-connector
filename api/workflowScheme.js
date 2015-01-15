"use strict";

module.exports = WorkflowSchemeClient;

/**
 * Used to access Jira REST endpoints in '/rest/api/2/workflowscheme'
 * @param {JiraClient} jiraClient
 * @constructor WorkflowSchemeClient
 */
function WorkflowSchemeClient(jiraClient) {
    this.jiraClient = jiraClient;

    /**
     * Create a new workflow scheme. The body contains a representation of the new scheme. Values not passed are
     * assumed to be set to their defaults.
     *
     * @method createWorkflowScheme
     * @memberOf WorkflowSchemeClient#
     * @param opts The request options sent to the Jira API.
     * @param opts.workflowScheme See {@link https://docs.atlassian.com/jira/REST/latest/#d2e2196}
     * @param callback Called when the workflow scheme has been created.
     */
    this.createWorkflowScheme = function (opts, callback) {
        var options = {
            uri: this.jiraClient.buildURL('/workflowscheme'),
            method: 'POST',
            json: true,
            followAllRedirects: true,
            body: opts.workflowScheme
        };
        this.jiraClient.makeRequest(options, callback);
    };

    /**
     * Update the passed workflow scheme. The body of the request is a representation of the workflow scheme. Values
     * not passed are assumed to indicate no change for that field. The passed representation can have its
     * updateDraftIfNeeded flag set to true to indicate that the draft should be created and/or updated when the actual
     * scheme cannot be edited (e.g. when the scheme is being used by a project). Values not appearing the body will
     * not be touched.
     *
     * @method editWorkflowScheme
     * @memberOf WorkflowSchemeClient#
     * @param opts The request options sent to the Jira API.
     * @param opts.workflowSchemeId The ID of the workflow scheme.
     * @param opts.workflowScheme See {@link https://docs.atlassian.com/jira/REST/latest/#d2e2305}
     * @param callback Called when the workflow scheme has been edited.
     */
    this.editWorkflowScheme = function (opts, callback) {
        var options = this.buildRequestOptions(opts, '', 'PUT', opts.workflowScheme);
        this.jiraClient.makeRequest(options, callback);
    };

    /**
     * Get the requested workflow scheme
     *
     * @method getWorkflowScheme
     * @memberOf WorkflowSchemeClient#
     * @param opts The request options sent to the Jira API.
     * @param opts.workflowSchemeId The ID of the workflow scheme.
     * @param [opts.returnDraftIfExists=false] when true indicates that a scheme's draft, if it exists, should be
     *     queried instead of the scheme itself.
     * @param callback Called when the workflow scheme has been retrieved.
     */
    this.getWorkflowScheme = function (opts, callback) {
        var options = this.buildRequestOptions(opts, '', 'GET', null, {returnDraftIfExists: opts.returnDraftIfExists});
        this.jiraClient.makeRequest(options, callback);
    };

    /**
     * Build out the request options necessary to make a particular API call.
     *
     * @private
     * @method buildRequestOptions
     * @memberOf WorkflowSchemeClient#
     * @param {Object} opts The arguments passed to the method.
     * @param {number} opts.workflowSchemeId The ID of the workflowScheme to use in the path.
     * @param {Array} [opts.fields] The fields to include
     * @param {Array} [opts.expand] The fields to expand
     * @param {string} path The path of the endpoint following /workflowScheme/{id}
     * @param {string} method The request method.
     * @param {Object} [body] The request body, if any.
     * @param {Object} [qs] The querystring, if any.  opts.expand and opts.fields arrays will be automagically added.
     * @returns {{uri: string, method: string, body: Object, qs: Object, followAllRedirects: boolean, json: boolean}}
     */
    this.buildRequestOptions = function (opts, path, method, body, qs) {
        var basePath = '/workflowscheme/' + opts.workflowSchemeId;
        if (!qs) qs = {};
        if (!body) body = {};

        if (opts.fields) {
            qs.fields = '';
            opts.fields.forEach(function (field) {
                qs.fields += field + ','
            });
            qs.fields = qs.fields.slice(0, -1);
        }

        if (opts.expand) {
            qs.expand = '';
            opts.expand.forEach(function (ex) {
                qs.expand += ex + ','
            });
            qs.expand = qs.expand.slice(0, -1);
        }

        return {
            uri: this.jiraClient.buildURL(basePath + path),
            method: method,
            body: body,
            qs: qs,
            followAllRedirects: true,
            json: true
        };
    };
}