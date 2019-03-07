(function () {
    'use strict';

    angular.module('app', [
        // Angular modules
        'ngRoute',
        'ngAnimate',
        'ngAria',

        // 3rd Party Modules
        'ui.bootstrap',
        'angular-loading-bar',
		'ngWebSocket',
        'angular-google-analytics',

        // Custom modules
        'app.nav',
        'app.i18n',
        'app.chart',
        'app.accounts',
        'app.assets',
        'app.markets',
        'app.committee_members',
        'app.fees',
        'app.objects',
        'app.operations',
        'app.proxies',
        'app.search',
        'app.txs',
        'app.voting',
        'app.witnesses',
        'app.workers',
        'app.blocks',
        'app.header'
    ]);

})();









;
(function () {
    'use strict';

    angular.module('app.nav', []);
    angular.module('app.header', []);

})();

;
(function () {
    'use strict';

    angular.module('app.accounts', []);
})();

;
(function () {
    'use strict';

    angular.module('app.assets', []);
})();

;
(function () {
    'use strict';

    angular.module('app.markets', []);
})();

;
(function () {
    'use strict';

    angular.module('app.committee_members', []);
})();

;
(function () {
    'use strict';

    angular.module('app.fees', []);
})();

;
(function () {
    'use strict';

    angular.module('app.objects', []);
})();

;
(function () {
    'use strict';

    angular.module('app.proxies', []);
})();

;
(function () {
    'use strict';

    angular.module('app.search', []);
})();

;
(function () {
    'use strict';

    angular.module('app.txs', []);
})();

;
(function () {
    'use strict';

    angular.module('app.voting', []);
})();

;
(function () {
    'use strict';

    angular.module('app.witnesses', []);
})();

;
(function () {
    'use strict';

    angular.module('app.workers', []);
})();

;
(function () {
    'use strict';

    angular.module('app.operations', []);
})();

;
(function () {
    'use strict';

    angular.module('app.blocks', []);
})();

;
(function () {
    'use strict';

    angular.module('app.chart', ['ngecharts']);
})(); 
;
(function() {
    'use strict';

    angular.module('app')
        .factory('appConfig', [appConfig]);


    angular.module('app').config(['AnalyticsProvider', function (AnalyticsProvider) {
        // Add configuration code as desired
        AnalyticsProvider.setAccount('UA-133419070-2');  //UU-XXXXXXX-X should be your tracking code
    }]).run(['Analytics', function(Analytics) { }]);

    function appConfig() {
        var pageTransitionOpts = [
            {
                name: 'Fade up',
                "class": 'animate-fade-up'
            }, {
                name: 'Scale up',
                "class": 'ainmate-scale-up'
            }, {
                name: 'Slide in from right',
                "class": 'ainmate-slide-in-right'
            }, {
                name: 'Flip Y',
                "class": 'animate-flip-y'
            }
        ];
        var date = new Date();
        var year = date.getFullYear();
        var main = {
            brand: 'Localcoin Explorer',
            name: 'LocalCoinIS',
            api_link: 'https://github.com/LocalCoinIS/localcoin-explorer-api.git',
            source_code_link: 'https://github.com/LocalCoinIS/LocalCoin-explorer.git',
            year: year,
            pageTransition: pageTransitionOpts[0]
        };
        var color = {
            primary:    '#4E7FE1',
            success:    '#81CA80',
            info:       '#6BBCD7',
            infoAlt:    '#7266BD',
            warning:    '#E9C842',
            danger:     '#E96562',
            gray:       '#DCDCDC'
        };

        var urls = {
            websocket: "wss://moscow.localcoin.is",
            python_backend: "https://api.llc.is",
            elasticsearch_wrapper: "https://api.llc.is",
            udf_wrapper: "https://api.llc.is"
        };

        return {
            pageTransitionOpts: pageTransitionOpts,
            main: main,
            color: color,
            urls: urls
        };
    }


})();

;
(function() {
    'use strict';

    angular.module('app')
        .factory('utilities', [utilities]);

    function utilities() {

        function formatNumber(x) {
            try {
                var parts = x.toString().split(".");

                if (x < 1) { parts[1] = parts[1]; }
                else if (x > 1 && x < 100) { parts[1] = parts[1].substr(0, 2); }
                else if (x > 100 && x < 1000) { parts[1] = parts[1].substr(0, 1); }
                else if (x > 1000) { parts[1] = ""; }

                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                if (x > 1000) { return parts[0]; }
                else { return parts.join("."); }
            }
            catch(err) {
                return x;
            }
        }

        return {
            opText: function (appConfig, $http, operation_type, operation, callback) {
                var operation_account = 0;
                var operation_text;
                var fee_paying_account;

                if (operation_type === 0) {
                    var from = operation.from;
                    var to = operation.to;

                    var amount_asset_id = operation.amount_.asset_id;
                    var amount_amount = operation.amount_.amount;

                    operation_account = from;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {

                            // get me the to name:
                            $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + to)
                                .then(function (response_name_to) {
                                    var to_name = response_name_to.data;

                                    $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + amount_asset_id)
                                        .then(function (response_asset) {

                                            var asset_name = response_asset.data[0]["symbol"];
                                            var asset_precision = response_asset.data[0]["precision"];

                                            var divideby = Math.pow(10, asset_precision);
                                            var amount = Number(amount_amount / divideby);

                                            operation_text =  "<a href='/#/accounts/" + from + "'>" + response_name.data + "</a>";
                                            operation_text = operation_text + " sent " + formatNumber(amount) + " <a href='/#/assets/" + amount_asset_id + "'>" + asset_name + "</a> to <a href='/#/accounts/" + to + "'>" + to_name + "</a>";

                                            callback(operation_text);
                                    });
                            });
                    });
                }
                else if (operation_type === 1) {
                    var seller = operation.seller;
                    operation_account = seller;

                    var amount_to_sell_asset_id = operation.amount_to_sell.asset_id;
                    var amount_to_sell_amount = operation.amount_to_sell.amount;

                    var min_to_receive_asset_id = operation.min_to_receive.asset_id;
                    var min_to_receive_amount = operation.min_to_receive.amount;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {

                            $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + amount_to_sell_asset_id)
                                .then(function (response_asset1) {

                                    var sell_asset_name = response_asset1.data[0]["symbol"];
                                    var sell_asset_precision = response_asset1.data[0]["precision"];

                                    var divideby = Math.pow(10, sell_asset_precision);
                                    var sell_amount = Number(amount_to_sell_amount / divideby);

                                    $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + min_to_receive_asset_id)
                                        .then(function (response_asset2) {

                                            var receive_asset_name = response_asset2.data[0]["symbol"];
                                            var receive_asset_precision = response_asset2.data[0]["precision"];

                                            var divideby = Math.pow(10, receive_asset_precision);
                                            var receive_amount = Number(min_to_receive_amount / divideby);

                                            operation_text =  "<a href='/#/accounts/" + operation_account + "'>" + response_name.data + "</a>";
                                            operation_text = operation_text + " wants " + formatNumber(receive_amount) + " <a href='/#/assets/" + min_to_receive_asset_id + "'>" + receive_asset_name + "</a> for ";
                                            operation_text = operation_text + formatNumber(sell_amount) + " <a href='/#/assets/" + amount_to_sell_asset_id + "'>" + sell_asset_name + "</a>";
                                            callback(operation_text);
                                    });
                            });
                    });
                }
                else if (operation_type === 2) {
                    fee_paying_account = operation.fee_paying_account;
                    operation_account = fee_paying_account;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {

                            operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data + "</a> cancel order";
                            callback(operation_text);
                    });
                }
                else if (operation_type === 3) {
                    var funding_account = operation.funding_account;
                    var delta_collateral_asset_id = operation.delta_collateral.asset_id;
                    var delta_debt_asset_id = operation.delta_debt.asset_id;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + funding_account)
                        .then(function (response_name) {

                            $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + delta_collateral_asset_id)
                                .then(function (response_asset1) {

                                    var asset1 = response_asset1.data[0]["symbol"];

                                    $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + delta_debt_asset_id)
                                        .then(function (response_asset2) {

                                            var asset2 = response_asset2.data[0]["symbol"];

                                            operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data + "</a> update debt/collateral for ";
                                            operation_text = operation_text + "<a href='#/markets/" + asset1 + "/" + asset2 + "'>" + asset1 + "/" + asset2 + "</a>";
                                            callback(operation_text);
                                    });
                            });
                    });
                }
                else if (operation_type === 4) {
                    var account_id = operation.account_id;
                    operation_account = account_id;

                    var pays_asset_id = operation.pays.asset_id;
                    var pays_amount = operation.pays.amount;

                    var receives_asset_id = operation.receives.asset_id;
                    var receives_amount = operation.receives.amount;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {


                            $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + pays_asset_id)
                                .then(function (response_asset1) {

                                    var pays_asset_name = response_asset1.data[0]["symbol"];
                                    var pays_asset_precision = response_asset1.data[0]["precision"];

                                    var divideby = Math.pow(10, pays_asset_precision);

                                    var p_amount = parseFloat(pays_amount / divideby);

                                    $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + receives_asset_id)
                                        .then(function (response_asset2) {

                                            var receive_asset_name = response_asset2.data[0]["symbol"];
                                            var receive_asset_precision = response_asset2.data[0]["precision"];

                                            var divideby = Math.pow(10, receive_asset_precision);
                                            var receive_amount = Number(receives_amount / divideby);

                                            operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data + "</a>";
                                            operation_text = operation_text + " paid " + formatNumber(p_amount) + " <a href='/#/assets/" + pays_asset_id + "'>" + pays_asset_name + "</a> for ";
                                            operation_text = operation_text + formatNumber(receive_amount) + " <a href='/#/assets/" + receives_asset_id + "'>" + receive_asset_name + "</a>";
                                            callback(operation_text);
                                    });
                            });
                    });
                }
                else if (operation_type === 5) {
                    var registrar = operation.registrar;
                    var referrer =  operation.referrer;
                    var name =  operation.name;
                    operation_account = registrar;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {

                            operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data + "</a>  register <a href='/#/accounts/" + name + "'>" + name + "</a>";

                            if(registrar !== referrer) {

                                $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + referrer)
                                    .then(function (response_name2) {

                                        operation_text = operation_text + " thanks to " + "<a href='/#/accounts/" + referrer + "'>" + response_name2.data + "</a>";
                                        callback(operation_text);
                                    });
                            }
                            else {
                                callback(operation_text);
                            }
                    });
                }
                else if (operation_type === 6) {
                    operation_account = operation.account;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {

                            operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data + "</a> updated account data";
                            callback(operation_text);
                    });
                }
                else if (operation_type === 14) {
                    var issuer = operation.issuer;
                    var issue_to_account =  operation.issue_to_account;
                    var asset_to_issue_amount = operation.asset_to_issue.amount;
                    var asset_to_issue_asset_id = operation.asset_to_issue.asset_id;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + issuer)
                        .then(function (response_name) {

                            $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + asset_to_issue_asset_id)
                                .then(function (response_asset) {

                                    var asset_name = response_asset.data[0]["symbol"];
                                    var asset_precision = response_asset.data[0]["precision"];

                                    var divideby = Math.pow(10, asset_precision);
                                    var amount = Number(asset_to_issue_amount / divideby);

                                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + issue_to_account)
                                        .then(function (response_name2) {

                                        operation_text = "<a href='/#/accounts/" + issuer + "'>" + response_name.data + "</a>  issued " + amount;
                                        operation_text = operation_text + " <a href='/#/assets/" + asset_to_issue_asset_id + "'>" + response_asset.data[0]["symbol"] + "</a>";
                                        operation_text = operation_text + " to <a href='/#/accounts/" + issue_to_account + "'>" + response_name2.data + "</a>";
                                        callback(operation_text);
                                    });
                            });
                    });
                }

                else if (operation_type === 15) {
                    operation_account = operation.payer;

                    var amount_to_reserve_amount = operation.amount_to_reserve.amount;
                    var amount_to_reserve_asset_id = operation.amount_to_reserve.asset_id;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {

                            $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + amount_to_reserve_asset_id)
                                .then(function (response_asset) {

                                    var asset_name = response_asset.data[0]["symbol"];
                                    var asset_precision = response_asset.data[0]["precision"];
                                    var divideby = Math.pow(10, asset_precision);
                                    var amount = Number(amount_to_reserve_amount / divideby);

                                    operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data +
                                        "</a> burned(reserved) " + formatNumber(amount) + " <a href='/#/assets/" + amount_to_reserve_asset_id + "'>" +
                                        asset_name + "</a>";
                                    callback(operation_text);
                            });
                    });
                }

                else if (operation_type === 19) {
                    var publisher = operation.publisher;
                    var asset_id =  operation.asset_id;
                    operation_account = publisher;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {

                            $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + asset_id)
                                .then(function (response_asset) {

                                    operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data + "</a>  published feed for ";
                                    operation_text = operation_text + "<a href='/#/assets/" + asset_id + "'>" + response_asset.data[0]["symbol"] + "</a>";
                                    callback(operation_text);
                            });
                    });
                }
                else if (operation_type === 22) {
                    fee_paying_account = operation.fee_paying_account;
                    operation_account = fee_paying_account;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {
                            operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data + "</a>  created a proposal";
                            callback(operation_text);
                    });
                }
                else if (operation_type === 23) {
                    fee_paying_account = operation.fee_paying_account;
                    var proposal = operation.proposal;
                    operation_account = fee_paying_account;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {
                            operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data + "</a>  updated ";
                            operation_text = operation_text + " proposal <a href='/#objects/"+proposal+"'>"+proposal+"</a>";
                            callback(operation_text);
                    });
                }

                else if (operation_type === 33) {
                    operation_account = operation.owner;

                    var amount_amount = operation.amount.amount;
                    var amount_asset_id = operation.amount.asset_id;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {

                            $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + amount_asset_id)
                                .then(function (response_asset) {

                                    var asset_name = response_asset.data[0]["symbol"];
                                    var asset_precision = response_asset.data[0]["precision"];
                                    var divideby = Math.pow(10, asset_precision);
                                    var amount = Number(amount_amount / divideby);

                                    operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data +
                                        "</a> withdrew vesting balance of " + formatNumber(amount) + " <a href='/#/assets/" + amount_to_reserve_asset_id + "'>" +
                                        asset_name + "</a>";
                                    callback(operation_text);
                                });
                        });
                }

                else if (operation_type === 37) { // BALANCE_CLAIM
                    operation_account = operation.deposit_to_account;

                    var total_claimed_amount = operation.total_claimed.amount;
                    var total_claimed_asset_id = operation.total_claimed.asset_id;

                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + operation_account)
                        .then(function (response_name) {

                            $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + total_claimed_asset_id)
                                .then(function (response_asset) {

                                    var asset_name = response_asset.data[0]["symbol"];
                                    var asset_precision = response_asset.data[0]["precision"];
                                    var divideby = Math.pow(10, asset_precision);
                                    var amount = Number(total_claimed_amount / divideby);

                                    operation_text = "<a href='/#/accounts/" + operation_account + "'>" + response_name.data +
                                        "</a> claimed a balance of " + formatNumber(amount) + " <a href='/#/assets/" + amount_to_reserve_asset_id + "'>" +
                                        asset_name + "</a>";
                                    callback(operation_text);
                                });
                        });
                }

                else {
                    operation_text = "";
                    callback(operation_text);
                }

            },
            operationType: function (opType) {
                var name;
                var color;
                var results = [];
                if(opType === 0) {
                    name = "TRANSFER";
                    color = "81CA80";
                }
                else if(opType === 1) {
                    name = "LIMIT ORDER CREATE";
                    color = "6BBCD7";
                }
                else if(opType === 2) {
                    name = "LIMIT ORDER CANCEL";
                    color = "E9C842";
                }
                else if(opType === 3) {
                    name = "CALL ORDER UPDATE";
                    color = "E96562";
                }
                else if(opType === 4) {
                    name = "FILL ORDER";
                    color = "008000";
                }
                else if(opType === 5) {
                    name = "ACCOUNT CREATE";
                    color = "CCCCCC";
                }
                else if(opType === 6) {
                    name = "ACCOUNT UPDATE";
                    color = "FF007F";
                }
                else if(opType === 7) {
                    name = "ACCOUNT WHIELIST";
                    color = "FB8817";
                }
                else if(opType === 8) {
                    name = "ACCOUNT UPGRADE";
                    color = "552AFF";
                }
                else if(opType === 9) {
                    name = "ACCOUNT TRANSFER";
                    color = "AA2AFF";
                }
                else if(opType === 10) {
                    name = "ASSET CREATE";
                    color = "D400FF";
                }
                else if(opType === 11) {
                    name = "ASSET UPDATE";
                    color = "0000FF";
                }
                else if(opType === 12) {
                    name = "ASSET UPDATE BITASSET";
                    color = "AA7FFF";
                }
                else if(opType === 13) {
                    name = "ASSET UPDATE FEED PRODUCERS";
                    color = "2A7FFF";
                }
                else if(opType === 14) {
                    name = "ASSET ISSUE";
                    color = "7FAAFF";
                }
                else if(opType === 15) {
                    name = "ASSET RESERVE";
                    color = "55FF7F";
                }
                else if(opType === 16) {
                    name = "ASSET FUND FEE POOL";
                    color = "55FF7F";
                }
                else if(opType === 17) {
                    name = "ASSET SETTLE";
                    color = "F1CFBB";
                }
                else if(opType === 18) {
                    name = "ASSET GLOBAL SETTLE";
                    color = "F1DFCC";
                }
                else if(opType === 19) {
                    name = "ASSET PUBLISH FEED";
                    color = "FF2A55";
                }
                else if(opType === 20) {
                    name = "WITNESS CREATE";
                    color = "FFAA7F";
                }
                else if(opType === 21) {
                    name = "WITNESS UPDATE";
                    color = "F1AA2A";
                }
                else if(opType === 22) {
                    name = "PROPOSAL CREATE";
                    color = "FFAA55";
                }
                else if(opType === 23) {
                    name = "PROPOSAL UPDATE";
                    color = "FF7F55";
                }
                else if(opType === 24) {
                    name = "PROPOSAL DELETE";
                    color = "FF552A";
                }
                else if(opType === 25) {
                    name = "WITHDRAW PERMISSION CREATE";
                    color = "FF00AA";
                }
                else if(opType === 26) {
                    name = "WITHDRAW PERMISSION";
                    color = "FF00FF";
                }
                else if(opType === 27) {
                    name = "WITHDRAW PERMISSION CLAIM";
                    color = "FF0055";
                }
                else if(opType === 28) {
                    name = "WITHDRAW PERMISSION DELETE";
                    color = "37B68Cc";
                }
                else if(opType === 29) {
                    name = "COMMITTEE MEMBER CREATE";
                    color = "37B68C";
                }
                else if(opType === 30) {
                    name = "COMMITTEE MEMBER UPDATE";
                    color = "6712E7";
                }
                else if(opType === 31) {
                    name = "COMMITTEE MEMBER UPDATE GLOBAL PARAMETERS";
                    color = "B637B6";
                }
                else if(opType === 32) {
                    name = "VESTING BALANCE CREATE";
                    color = "A5A5A5";
                }
                else if(opType === 33) {
                    name = "VESTING BALANCE WITHDRAW";
                    color = "696969";
                }
                else if(opType === 34) {
                    name = "WORKER CREATE";
                    color = "0F0F0F";
                }
                else if(opType === 35) {
                    name = "CUSTOM";
                    color = "0DB762";
                }
                else if(opType === 36) {
                    name = "ASSERT";
                    color = "D1EEFF";
                }
                else if(opType === 37) {
                    name = "BALANCE CLAIM";
                    color = "939314";
                }
                else if(opType === 38) {
                    name = "OVERRIDE TRANSFER";
                    color = "8D0DB7";
                }
                else if(opType === 39) {
                    name = "TRANSFER TO BLIND";
                    color = "C4EFC4";
                }
                else if(opType === 40) {
                    name = "BLIND TRANSFER";
                    color = "F29DF2";
                }
                else if(opType === 41) {
                    name = "TRANSFER FROM BLIND";
                    color = "9D9DF2";
                }
                else if(opType === 42) {
                    name = "ASSET SETTLE CANCEL";
                    color = "4ECEF8";
                }
                else if(opType === 43) {
                    name = "ASSET CLAIM FEES";
                    color = "F8794E";
                }
                else if(opType === 44) {
                    name = "FBA DISTRIBUTE";
                    color = "8808B2";
                }
                else if(opType === 45) {
                    name = "BID COLLATERAL";
                    color = "6012B1";
                }
                else if(opType === 46) {
                    name = "EXECUTE BID";
                    color = "1D04BB";
                }
                else if(opType === 47) {
                    name = "ASSET CLAIM POOL";
                    color = "AAF654";
                }
                else if(opType === 48) {
                    name = "ASSET UPDATE ISSUER";
                    color = "AB7781";
                }

                results[0] = name;
                results[1] = color;

                return results;
            },
            formatBalance: function (number, presicion) {
                var divideby =  Math.pow(10, presicion);
                return Number(number/divideby);
            },
            objectType: function (id) {
                var parts = id.split(".");
                var object_type = "";
                if (parts[0] == "1" && parts[1] == "1")
                    object_type = "BASE";
                else if (parts[0] == "1" && parts[1] == "2")
                    object_type = "ACCOUNT";
                else if (parts[0] == "1" && parts[1] == "3")
                    object_type = "ASSET";
                else if (parts[0] == "1" && parts[1] == "4")
                    object_type = "FORCE SETTLEMENT";
                else if (parts[0] == "1" && parts[1] == "5")
                    object_type = "COMMITTEE MEMBER";
                else if (parts[0] == "1" && parts[1] == "6")
                    object_type = "WITNESS";
                else if (parts[0] == "1" && parts[1] == "7")
                    object_type = "LIMIT ORDER";
                else if (parts[0] == "1" && parts[1] == "8")
                    object_type = "CALL ORDER";
                else if (parts[0] == "1" && parts[1] == "9")
                    object_type = "CUSTOM";
                else if (parts[0] == "1" && parts[1] == "10")
                    object_type = "PROPOSAL";
                else if (parts[0] == "1" && parts[1] == "11")
                    object_type = "OPERATION HISTORY";
                else if (parts[0] == "1" && parts[1] == "12")
                    object_type = "WITHDRAW PERMISSION";
                else if (parts[0] == "1" && parts[1] == "13")
                    object_type = "VESTING BALANCE";
                else if (parts[0] == "1" && parts[1] == "14")
                    object_type = "WORKER";
                else if (parts[0] == "1" && parts[1] == "15")
                    object_type = "BALANCE";
                else if (parts[0] == "2" && parts[1] == "0")
                    object_type = "GLOBAL PROPERTY";
                else if (parts[0] == "2" && parts[1] == "1")
                    object_type = "DYNAMIC GLOBAL PROPERTY";
                else if (parts[0] == "2" && parts[1] == "3")
                    object_type = "ASSET DYNAMIC DATA";
                else if (parts[0] == "2" && parts[1] == "4")
                    object_type = "ASSET BITASSET DATA";
                else if (parts[0] == "2" && parts[1] == "5")
                    object_type = "ACCOUNT BALANCE";
                else if (parts[0] == "2" && parts[1] == "6")
                    object_type = "ACCOUNT STATISTICS";
                else if (parts[0] == "2" && parts[1] == "7")
                    object_type = "TRANSACTION";
                else if (parts[0] == "2" && parts[1] == "8")
                    object_type = "BLOCK SUMMARY";
                else if (parts[0] == "2" && parts[1] == "9")
                    object_type = "ACCOUNT TRANSACTION HISTORY";
                else if (parts[0] == "2" && parts[1] == "10")
                    object_type = "BLINDED BALANCE";
                else if (parts[0] == "2" && parts[1] == "11")
                    object_type = "CHAIN PROPERTY";
                else if (parts[0] == "2" && parts[1] == "12")
                    object_type = "WITNESS SCHEDULE";
                else if (parts[0] == "2" && parts[1] == "13")
                    object_type = "BUDGET RECORD";
                else if (parts[0] == "2" && parts[1] == "14")
                    object_type = "SPECIAL AUTHORITY";

                return object_type;
            },
            columnsort: function ($scope, column, sortColumn, sortClass, reverse, reverseclass, columnToSort) {

                $scope[column] = column;
                $scope[columnToSort] = column;


                // sort ordering (Ascending or Descending). Set true for desending
                $scope[reverse] = true;

                // called on header click
                $scope[sortColumn] = function(col){
                    $scope[columnToSort] = col;
                    if($scope[reverse]){
                        $scope[reverse] = false;
                        $scope[reverseclass] = 'arrow-up';
                    } else {
                        $scope[reverse] = true;
                        $scope[reverseclass] = 'arrow-down';
                    }
                };
                // remove and change class
                $scope[sortClass] = function(col) {
                    if ($scope[columnToSort] === col) {
                        //console.log($scope[column_name] + " - " + col);
                        if ($scope[reverse]) {
                            return 'arrow-down';
                        } else {
                            return 'arrow-up';
                        }
                    } else {
                        return '';
                    }
                };
            }
        }
    }

})();

;
(function() {
    'use strict';

    angular.module('app').factory('networkService', networkService);
    networkService.$inject = ['$http', 'appConfig', 'utilities'];

    function networkService($http, appConfig, utilities) {

        return {
            getHeader: function(callback) {
                var header;
                $http.get(appConfig.urls.python_backend + "/header").then(function(response) {

                    header = {
                        head_block_number: response.data.head_block_number,
                        accounts_registered_this_interval: response.data.accounts_registered_this_interval,
                        bts_market_cap: response.data.bts_market_cap,
                        quote_volume: response.data.quote_volume,
                        witness_count: response.data.witness_count,
                        committee_count: response.data.commitee_count
                    };
                    callback(header);
                });
            },

            getBigBlocks: function(callback) {
                $http.get(appConfig.urls.elasticsearch_wrapper + "/get_account_history?from_date=now-1w&to_date=now&type=aggs&agg_field=block_data.block_num&size=20")
                    .then(function (response) {

                    var blocks = [];
                    angular.forEach(response.data, function (value, key) {
                        $http.get(appConfig.urls.python_backend + "/get_block?block_num=" + value.key).then(function (response) {

                            var parsed = {
                                block_num: value.key,
                                operations: value.doc_count,
                                transactions: response.data.transactions.length,
                                timestamp: response.data.timestamp
                            };
                            blocks.push(parsed);
                        });
                    });
                    callback(blocks);
                });
            },
            getLastOperations: function(limit, from, callback) {
                $http.get(appConfig.urls.elasticsearch_wrapper + "/get_account_history?size=" + limit + "&from_=" + from)
                    .then(function (response) {

                    var lastops = [];
                    angular.forEach(response.data, function (value, key) {

                        var operation = {};
                        operation.block_num = value.block_data.block_num;
                        operation.operation_id = value.account_history.operation_id;
                        operation.time = value.block_data.block_time;

                        //var parsed_op = JSON.parse(value.operation_history.op);
                        var parsed_op = value.operation_history.op_object;

                        utilities.opText(appConfig, $http, value.operation_type, parsed_op, function(returnData) {
                            operation.operation_text = returnData;
                        });

                        var type_res =  utilities.operationType(value.operation_type);
                        operation.type = type_res[0];
                        operation.color = type_res[1];

                        lastops.push(operation);

                    });
                    callback(lastops);
                });
            },

            getBigTransactions: function(callback) {
                $http.get(appConfig.urls.elasticsearch_wrapper + "/get_account_history?from_date=now-1h&to_date=now&type=aggs&agg_field=block_data.trx_id.keyword&size=20")
                    .then(function (response) {

                    var transactions = [];
                    angular.forEach(response.data, function (value, key) {
                        if(value.key !== "") {
                            var parsed = {
                                trx_id: value.key,
                                count: value.doc_count
                            };
                            transactions.push(parsed);
                        }
                    });
                    callback(transactions);
                });
            },

            getTransactionMetaData: function(trx, callback) {
                var data;
                $http.get(appConfig.urls.elasticsearch_wrapper + "/get_trx?trx=" + trx + "&size=1&sort=-operation_history.sequence")
                    .then(function(response) {

                    data = {
                        hash: response.data[0].block_data.trx_id,
                        counter: response.data[0].operation_history.op_in_trx,
                        block_num: response.data[0].block_data.block_num,
                        date: response.data[0].block_data.block_time
                    };
                    callback(data);
                });
            },

            getTransactionOperations: function(trx, callback) {
                var data;
                $http.get(appConfig.urls.elasticsearch_wrapper + "/get_trx?trx=" + trx + "&size=100&sort=-operation_history.sequence")
                    .then(function(response) {

                    var operations = [];
                    angular.forEach(response.data, function (value, key) {
                        var op = utilities.operationType(value.operation_type);
                        var op_type = op[0];
                        var op_color = op[1];

                        var parsed = {
                            operation_id: value.account_history.operation_id,
                            op_color: op_color,
                            op_type: op_type
                        };

                        var opArray = value.operation_history.op_object;
                        utilities.opText(appConfig, $http, value.operation_type, opArray, function (returnData) {
                            parsed.operation_text = returnData;
                        });
                        operations.push(parsed);
                    });
                    callback(operations);
                });
            },
            getFees: function(callback) {
                var fees = [];
                $http.get(appConfig.urls.python_backend + "/fees").then(function(response) {
                    var basic_fee = 0;
                    //var premium_fee = 0;
                    //var price_per_kbyte = 0;
                    for(var i = 0; i < response.data.parameters.current_fees.parameters.length; i++) {
                        if (response.data.parameters.current_fees.parameters[i][1].fee) {
                            basic_fee = response.data.parameters.current_fees.parameters[i][1].fee;
                        }
                        else {
                            basic_fee = response.data.parameters.current_fees.parameters[i][1].basic_fee;
                        }
                        var op_type  = utilities.operationType(response.data.parameters.current_fees.parameters[i][0]);

                        var fee = {
                            identifier: response.data.parameters.current_fees.parameters[i][0],
                            operation: op_type[0],
                            color: op_type[1],
                            basic_fee: utilities.formatBalance(basic_fee, 5),
                            premium_fee: utilities.formatBalance(response.data.parameters.current_fees.parameters[i][1].premium_fee, 5),
                            price_per_kbyte: utilities.formatBalance(response.data.parameters.current_fees.parameters[i][1].price_per_kbyte, 5)
                        };
                        fees.push(fee);
                    }
                });
                callback(fees);
            },
            getOperation: function(operation, callback) {
                var op;
                $http.get(appConfig.urls.python_backend + "/operation_full_elastic?operation_id=" + operation).then(function(response) {
                    var raw_obj = response.data[0].op;
                    var op_type =  utilities.operationType(response.data[0].op_type);

                    utilities.opText(appConfig, $http, response.data[0].op_type, raw_obj, function(returnData) {
                        op = {
                            name: operation,
                            block_num: response.data[0].block_num,
                            virtual_op: response.data[0].virtual_op,
                            trx_in_block: response.data[0].trx_in_block,
                            op_in_trx: response.data[0].op_in_trx,
                            result: response.data[0].result,
                            type: op_type[0],
                            color: op_type[1],
                            raw: raw_obj,
                            operation_text: returnData,
                            block_time: response.data[0].block_time,
                            trx_id: response.data[0].trx_id
                        };
                        callback(op);
                    });
                });
            },
            getBlock: function(block_num, callback) {
                var block;
                $http.get(appConfig.urls.python_backend + "/get_block?block_num=" + block_num).then(function (response) {
                    var operations_count = 0;
                    for (var i = 0; i < response.data.transactions.length; i++) {
                        operations_count = operations_count + response.data.transactions[i].operations.length;
                    }
                    block = {
                        transactions: response.data.transactions,
                        block_num: block_num,
                        previous: response.data.previous,
                        timestamp: response.data.timestamp,
                        witness: response.data.witness,
                        witness_signature: response.data.witness_signature,
                        transaction_merkle_root: response.data.transaction_merkle_root,
                        transactions_count: response.data.transactions.length,
                        operations_count: operations_count,
                        next: parseInt(block_num) + 1,
                        prev: parseInt(block_num) - 1
                    };
                    callback(block);
                });
            },
            getObject: function(object, callback) {
                $http.get(appConfig.urls.python_backend + "/get_object?object=" + object).then(function(response) {
                    var object_id = response.data[0].id;
                    var object_type = utilities.objectType(object_id);

                    var object = {
                        raw: response.data,
                        name: object_id,
                        type: object_type
                    };
                    callback(object);
                });
            }
        };
    }

})();

;
(function() {
    'use strict';

    angular.module('app').factory('marketService', marketService);
    marketService.$inject = ['$http', 'appConfig', 'utilities'];

    function marketService($http, appConfig, utilities) {

        return {
            getActiveMarkets: function(callback) {
                var markets = [];
                $http.get(appConfig.urls.python_backend + "/get_most_active_markets").then(function(response) {

                    angular.forEach(response.data, function(value, key) {
                        var market = {
                            pair: value[1],
                            price: value[3],
                            volume: value[4]
                        };
                        markets.push(market);
                    });

                    callback(markets);
                });
            },
            getAssetMarkets: function(asset_id, callback) {
                var markets = [];
                $http.get(appConfig.urls.python_backend + "/get_markets?asset_id=" + asset_id).then(function(response) {
                    angular.forEach(response.data, function(value, key) {
                        var market = {
                            pair: value[1],
                            price: value[3],
                            volume: value[4]
                        };
                        markets.push(market);
                    });
                    callback(markets);
                });
            },
            getOrderBook: function(base, quote, base_precision, quote_precision, callback) {
                var order_book = [];
                var asks = [];
                var bids = [];
                $http.get(appConfig.urls.python_backend + "/get_order_book?base=" + base + "&quote=" + quote + "&limit=10")
                    .then(function(response) {

                    var total = 0;
                    angular.forEach(response.data.asks, function(value, key) {
                        total = total + parseFloat(value.base);
                        var parsed = {
                            base1: parseFloat(value.base),
                            price1: parseFloat(value.price),
                            quote1: parseFloat(value.quote),
                            base_precision: base_precision,
                            quote_precision: quote_precision,
                            total1: total
                        };
                        asks.push(parsed);
                    });
                    total = 0;
                    angular.forEach(response.data.bids, function(value, key) {
                        total = total + parseFloat(value.base);
                        var parsed = {
                            base2: parseFloat(value.base),
                            price2: parseFloat(value.price),
                            quote2: parseFloat(value.quote),
                            base_precision: base_precision,
                            quote_precision: quote_precision,
                            total2: total
                        };
                        bids.push(parsed);
                    });
                    order_book[0] = asks;
                    order_book[1] = bids;
                    callback(order_book);
                });
            },
            getGroupedOrderBook: function(base, quote, base_precision, quote_precision, callback) {
                var grouped = [];
                $http.get(appConfig.urls.python_backend + "/get_grouped_limit_orders?base=" + base + "&quote=" + quote + "&group=10&limit=10")
                    .then(function(response) {

                    angular.forEach(response.data, function(value, key) {
                        var total_for_sale = value.total_for_sale;
                        var max_base_amount = parseInt(value.max_price.base.amount);
                        var max_quote_amount = parseInt(value.max_price.quote.amount);
                        var min_base_amount = parseInt(value.min_price.base.amount);
                        var min_quote_amount = parseInt(value.min_price.quote.amount);

                        var base_id = value.max_price.base.asset_id;
                        var quote_id = value.max_price.quote.asset_id;

                        var base_array = base_id.split(".");
                        var quote_array = quote_id.split(".");
                        var divide = 0;

                        if(base_array[2] > quote_array[2])
                        {
                            divide = 1;
                        }
                        var qp = Math.pow(10, parseInt(quote_precision));
                        var bp = Math.pow(10, parseInt(base_precision));

                        var max_price;
                        var min_price;
                        var min;
                        var max;
                        if(divide) {
                            max = (max_quote_amount / qp) / (max_base_amount / bp);
                            max_price = 1 / max;
                            min = (min_quote_amount / qp) / (min_base_amount / bp);
                            min_price = 1 / min;
                        }
                        else {
                            max_price = parseFloat(max_base_amount / bp) / parseFloat(max_quote_amount / qp);
                            min_price = parseFloat(min_base_amount / bp) / parseFloat(min_quote_amount / qp);
                        }
                        total_for_sale = Number(total_for_sale/bp);

                        var parsed = {
                                max_price: max_price,
                                min_price: min_price,
                                total_for_sale: total_for_sale,
                                base_precision: base_precision,
                                quote_precision: quote_precision
                        };
                        grouped.push(parsed);
                    });
                    callback(grouped);
                });
            },
            getAssetPrecision: function(asset_id, callback) {
                var precision;
                $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + asset_id).then(function (response) {
                    precision = response.data[0].precision;
                    callback(precision);
                });
            },
            getTicker: function(base, quote, callback) {
                var ticker = {};
                $http.get(appConfig.urls.python_backend + "/get_ticker?base=" + base + "&quote=" + quote).then(function(response) {
                    var ticker = {
                        price: response.data.latest,
                        ask: response.data.lowest_ask,
                        bid: response.data.highest_bid,
                        base_volume: parseInt(response.data.base_volume),
                        quote_volume: parseInt(response.data.quote_volume),
                        perc_change: response.data.percent_change,
                        base: base,
                        quote: quote
                        //base_precision: base_precision
                    };
                    callback(ticker);
                });
            }
        };
    }

})();

;
(function() {
    'use strict';

    angular.module('app').factory('assetService', assetService);
    assetService.$inject = ['$http', 'appConfig', 'utilities'];

    function assetService($http, appConfig, utilities) {

        return {
            getActiveAssets: function(callback) {
                var assets = [];

                $http.get(appConfig.urls.python_backend + "/assets").then(function (response) {

                    angular.forEach(response.data, function (value, key) {

                        var market_cap;
                        var supply;

                        if (value[1].indexOf("OPEN") >= 0 || value[1].indexOf("RUDEX") >= 0 ||
                            value[1].indexOf("BRIDGE") >= 0 || value[1].indexOf("GDEX") >= 0) {
                            market_cap = "-";
                            supply = "-";
                        }
                        else {
                            market_cap = Math.round(value[5] / 100000); // in llc always by now
                            var precision = 100000;
                            if (value[10]) {
                                precision = Math.pow(10, value[10]);
                            }
                            supply = Math.round(value[7] / precision);
                        }
                        var volume = Math.round(value[4]);

                        var asset = {
                            name: value[1],
                            id: value[2],
                            price: value[3],
                            volume: volume,
                            type: value[6],
                            market_cap: market_cap,
                            supply: supply,
                            holders: value[8]
                        };

                        /* Todo: create function */
                        var name_lower = value[1].replace("OPEN.", "").toLowerCase();
                        var url = "images/asset-symbols/" + name_lower + ".png";
                        var image_url = "";
                        $http({method: 'GET', url: url}).then(function successCallback(response) {
                            image_url = "images/asset-symbols/" + name_lower + ".png";
                            asset.image_url = image_url;
                            assets.push(asset);
                        }, function errorCallback(response) {
                            image_url = "images/asset-symbols/white.png";
                            asset.image_url = image_url;
                            assets.push(asset);
                        });

                    });
                    callback(assets);
                });
            },
            getDexVolume: function(callback) {
                var dex;
                $http.get(appConfig.urls.python_backend + "/get_dex_total_volume").then(function (response) {
                    dex = {
                        volume_bts: response.data.volume_bts,
                        volume_cny: response.data.volume_cny,
                        volume_usd: response.data.volume_usd,
                        market_cap_bts: response.data.market_cap_bts.toString().slice(0, -12),
                        market_cap_cny: response.data.market_cap_cny.toString().slice(0, -12),
                        market_cap_usd: response.data.market_cap_usd.toString().slice(0, -12)
                    };
                    callback(dex);
                });
            },
            getAssetFull: function(asset_id, callback) {

                $http.get(appConfig.urls.python_backend + "/get_asset_and_volume?asset_id=" + asset_id).then(function(response) {

                    var type;
                    var description;
                    if (response.data[0].issuer === "1.2.0") {
                        description = response.data[0].options.description;
                        type = "SmartCoin";
                    }
                    else {
                        var description_p = response.data[0].options.description.split('"');
                        description = description_p[3];
                        type = "User Issued";
                    }
                    if (response.data[0].symbol === "LLC") {
                        type = "Core Token";
                    }

                    var long_description = false;
                    try {
                        if (description.length > 100) {
                            long_description = true;
                        }
                    }
                    catch (err) {
                    }

                    var asset  = {
                        symbol: response.data[0].symbol,
                        id: response.data[0].id,
                        description: description,
                        long_description: long_description,
                        max_supply: utilities.formatBalance(response.data[0].options.max_supply, response.data[0].precision),
                        issuer: response.data[0].issuer,
                        precision: response.data[0].precision,
                        current_supply: utilities.formatBalance(response.data[0].current_supply, response.data[0].precision),
                        confidential_supply: utilities.formatBalance(response.data[0].confidential_supply, response.data[0].precision),
                        issuer_name: response.data[0].issuer_name,
                        accumulated_fees: utilities.formatBalance(response.data[0].accumulated_fees, response.data[0].precision),
                        fee_pool: utilities.formatBalance(response.data[0].fee_pool, response.data[0].precision),
                        type: type,
                        volume: parseInt(response.data[0].volume),
                        market_cap: response.data[0].mcap/100000,
                        bitasset_data_id: response.data[0].bitasset_data_id,
                        dynamic_asset_data_id: response.data[0].dynamic_asset_data_id

                    };

                    /* Todo: create function */
                    var name_lower = response.data[0].symbol.replace("OPEN.", "").toLowerCase();
                    var url = "images/asset-symbols/" + name_lower + ".png";
                    var image_url = "";
                    $http({method: 'GET', url: url}).then(function successCallback(response22) {
                        image_url = "images/asset-symbols/" + name_lower + ".png";
                        asset.image_url = image_url;
                    }, function errorCallback(response22) {
                        image_url = "images/asset-symbols/white.png";
                        asset.image_url = image_url;
                    });

                    callback(asset);

                });
            },
            getAssetHolders: function(asset_id, precision, callback) {
                var accounts = [];
                $http.get(appConfig.urls.python_backend + "/get_asset_holders?asset_id=" + asset_id).then(function(response) {
                    angular.forEach(response.data, function(value, key) {
                        var account = {
                            name: value.name,
                            amount: utilities.formatBalance(value.amount, precision),
                            id: value.account_id
                        };
                        accounts.push(account);
                    });
                    callback(accounts);
                });
            },
            getAssetHoldersCount: function(asset_id, callback) {
                $http.get(appConfig.urls.python_backend + "/get_asset_holders_count?asset_id=" + asset_id).then(function(response) {
                    var holders_count = response.data;
                    callback(holders_count);
                });
            },
            getAssetNameAndPrecision: function(asset_id, callback) {
                var results = {};
                $http.get(appConfig.urls.python_backend + "/get_asset?asset_id=" + asset_id).then(function (response) {
                    results.symbol = response.data[0].symbol;
                    results.precision = response.data[0].precision;
                    callback(results);
                });
            }
        };
    }

})();

;
(function() {
    'use strict';

    angular.module('app').factory('chartService', chartService);
    chartService.$inject = ['$http', 'appConfig', 'utilities'];

    function chartService($http, appConfig, utilities) {

        return {
            dailyDEXChart: function(callback) {

                var dex_volume_chart = {};
                $http.get(appConfig.urls.python_backend + "/daily_volume_dex_dates").then(function (response) {
                    $http.get(appConfig.urls.python_backend + "/daily_volume_dex_data").then(function (response2) {

                        dex_volume_chart.options = {
                            animation: true,
                            title: {
                                text: 'Daily DEX Volume in LLC for the last 30 days'
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    saveAsImage: {show: true, title: "save as image"}
                                }
                            },
                            xAxis: [{
                                boundaryGap: true,
                                data: response.data
                            }],
                            yAxis: [{
                                type: 'value',
                                scale: true,
                                axisLabel: {
                                    formatter: function (value) {
                                        return value / 1000000 + "M";
                                    }
                                }
                            }],
                            calculable: true,
                            series: [{
                                name: 'Volume',
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: 'green',
                                        borderColor: 'green'
                                    }
                                },
                                data: response2.data
                            }]
                        };
                        callback(dex_volume_chart);
                    });
                });
            },
            TradingView: function(base, quote) {
                var widget = window.tvWidget = new TradingView.widget({
                    fullscreen: true,
                    symbol: base + '_' + quote,
                    interval: '60',
                    container_id: "tv_chart_container",
                    //	BEWARE: no trailing slash is expected in feed URL
                    datafeed: new Datafeeds.UDFCompatibleDatafeed(appConfig.urls.udf_wrapper),
                    library_path: "charting_library/",
                    locale: getParameterByName('lang') || "en",
                    //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
                    drawings_access: { type: 'black', tools: [ { name: "Regression Trend" } ] },
                    disabled_features: ["use_localstorage_for_settings"],
                    enabled_features: ["study_templates"],
                    charts_storage_url: 'http://saveload.tradingview.com',
                    charts_storage_api_version: "1.1",
                    client_id: 'tradingview.com',
                    user_id: 'public_user_id'
                });
                function getParameterByName(name) {
                    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                        results = regex.exec(location.search);
                    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                }
            },
            topOperationsChart: function(callback) {
                $http.get(appConfig.urls.elasticsearch_wrapper + "/get_account_history?from_date=now-1d&to_date=now&type=aggs&agg_field=operation_type&size=10")
                    .then(function(response) {

                    var legends = [];
                    var data = [];
                    var c = 0;
                    for(var i = 0; i < response.data.length; i++) {

                        ++c;
                        if(c > 7) { break; }

                        var name =  utilities.operationType(response.data[i].key)[0];
                        var color =  utilities.operationType(response.data[i].key)[1];

                        data.push({
                            value: response.data[i].doc_count,
                            name: name,
                            itemStyle: {
                                normal: {
                                    color: '#' + color
                                }
                            }
                        });

                        legends.push(name);
                    }
                    var operations_chart = {};
                    operations_chart.options = {
                        animation: true,
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: legends,
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {show: true, title: "save as image"}
                            }
                        },
                        calculable: true,
                        series: [{
                            name: 'Operation Type',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            data: data,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            }
                        }]
                    };
                    callback(operations_chart);
                });
            },
            topProxiesChart: function(callback) {
                $http.get(appConfig.urls.python_backend + "/top_proxies").then(function(response) {

                    var proxies_chart = {};
                    proxies_chart.options = {
                        animation: true,
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: [
                                response.data[0][1],
                                response.data[1][1],
                                response.data[2][1],
                                response.data[3][1],
                                response.data[4][1],
                                response.data[5][1],
                                response.data[6][1]
                            ]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {show: true, title: "save as image"}
                            }
                        },
                        calculable: true,
                        series: [{
                            color: ['#81CA80','#6BBCD7', '#E9C842', '#E96562', '#008000', '#FB8817', '#552AFF'],
                            name: 'Proxies',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        position: 'center',
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                }
                            },
                            data: [
                                {value: response.data[0][2], name: response.data[0][1]},
                                {value: response.data[1][2], name: response.data[1][1]},
                                {value: response.data[2][2], name: response.data[2][1]},
                                {value: response.data[3][2], name: response.data[3][1]},
                                {value: response.data[4][2], name: response.data[4][1]},
                                {value: response.data[5][2], name: response.data[5][1]},
                                {value: response.data[6][2], name: response.data[6][1]}
                            ]
                        }]
                    };
                    callback(proxies_chart);
                });
            },
            topMarketsChart: function(callback) {
                $http.get(appConfig.urls.python_backend + "/top_markets").then(function(response) {

                    var markets_chart = {};
                    markets_chart.options = {
                        animation: true,
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: [
                                response.data[0][0],
                                response.data[1][0],
                                response.data[2][0],
                                response.data[3][0],
                                response.data[4][0],
                                response.data[5][0],
                                response.data[6][0]
                            ]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {show: true, title: "save as image"}
                            }
                        },
                        calculable: true,
                        series: [{
                            color: ['#81CA80','#6BBCD7', '#E9C842', '#E96562', '#008000', '#FB8817', '#552AFF'],
                            name: 'Traffic source',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        position: 'center',
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                }
                            },
                            data: [
                                {value: response.data[0][1], name: response.data[0][0]},
                                {value: response.data[1][1], name: response.data[1][0]},
                                {value: response.data[2][1], name: response.data[2][0]},
                                {value: response.data[3][1], name: response.data[3][0]},
                                {value: response.data[4][1], name: response.data[4][0]},
                                {value: response.data[5][1], name: response.data[5][0]},
                                {value: response.data[6][1], name: response.data[6][0]}
                            ]
                        }]
                    };
                    callback(markets_chart);
                });
            },
            topSmartCoinsChart: function(callback) {
                $http.get(appConfig.urls.python_backend + "/top_smartcoins").then(function(response) {
                    var smartcoins_chart = {};
                    smartcoins_chart.options = {
                        animation: true,
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: [
                                response.data[0][0],
                                response.data[1][0],
                                response.data[2][0],
                                response.data[3][0],
                                response.data[4][0],
                                response.data[5][0],
                                response.data[6][0]
                            ]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {show: true, title: "save as image"}
                            }
                        },
                        calculable: true,
                        series: [{
                            color: ['#81CA80','#6BBCD7', '#E9C842', '#E96562', '#008000', '#FB8817', '#552AFF'],
                            name: 'Top Smartcoins',
                            type: 'pie',
                            roseType: 'radius',
                            max: 40,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                }
                            },
                            data: [
                                {value: response.data[0][1], name: response.data[0][0]},
                                {value: response.data[1][1], name: response.data[1][0]},
                                {value: response.data[2][1], name: response.data[2][0]},
                                {value: response.data[3][1], name: response.data[3][0]},
                                {value: response.data[4][1], name: response.data[4][0]},
                                {value: response.data[5][1], name: response.data[5][0]},
                                {value: response.data[6][1], name: response.data[6][0]}
                            ]
                        }]
                    };
                    callback(smartcoins_chart);
                });
            },
            topUIAsChart: function(callback) {
                $http.get(appConfig.urls.python_backend + "/top_uias").then(function(response) {
                    var uias_chart = {};
                    uias_chart.options = {
                        animation: true,
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: [
                                response.data[0][0],
                                response.data[1][0],
                                response.data[2][0],
                                response.data[3][0],
                                response.data[4][0],
                                response.data[5][0],
                                response.data[6][0]
                            ]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {show: true, title: "save as image"}
                            }
                        },
                        calculable: true,
                        series: [{
                            color: ['#81CA80','#6BBCD7', '#E9C842', '#E96562', '#008000', '#FB8817', '#552AFF'],
                            name: 'Top User Issued Assets',
                            type: 'pie',
                            roseType: 'radius',
                            max: 40,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true
                                    },
                                    labelLine: {
                                        show: true
                                    }
                                }
                            },
                            data: [
                                {value: response.data[0][1], name: response.data[0][0]},
                                {value: response.data[1][1], name: response.data[1][0]},
                                {value: response.data[2][1], name: response.data[2][0]},
                                {value: response.data[3][1], name: response.data[3][0]},
                                {value: response.data[4][1], name: response.data[4][0]},
                                {value: response.data[5][1], name: response.data[5][0]},
                                {value: response.data[6][1], name: response.data[6][0]}
                            ]
                        }]
                    };
                    callback(uias_chart);
                });
            },
            topHoldersChart: function(callback) {
                $http.get(appConfig.urls.python_backend + "/top_holders").then(function(response) {

                    var holders_chart = {};
                    holders_chart.options = {
                        animation: true,
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            data: [
                                response.data[0][2],
                                response.data[1][2],
                                response.data[2][2],
                                response.data[3][2],
                                response.data[4][2],
                                response.data[5][2],
                                response.data[6][2]
                            ]
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                saveAsImage: {show: true, title: "save as image"}
                            }
                        },
                        calculable: true,
                        series: [{
                            color: ['#81CA80','#6BBCD7', '#E9C842', '#E96562', '#008000', '#FB8817', '#552AFF'],
                            name: 'Holders',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: true,
                                        position: 'center',
                                        textStyle: {
                                            fontSize: '30',
                                            fontWeight: 'bold'
                                        }
                                    }
                                }
                            },
                            data: [
                                {value: response.data[0][3], name: response.data[0][2]},
                                {value: response.data[1][3], name: response.data[1][2]},
                                {value: response.data[2][3], name: response.data[2][2]},
                                {value: response.data[3][3], name: response.data[3][2]},
                                {value: response.data[4][3], name: response.data[4][2]},
                                {value: response.data[5][3], name: response.data[5][2]},
                                {value: response.data[6][3], name: response.data[6][2]}
                            ]
                        }]
                    };
                    callback(holders_chart);
                });
            }
        };
    }

})();

;
(function() {
    'use strict';

    angular.module('app').factory('accountService', accountService);
    accountService.$inject = ['$http', 'appConfig', 'utilities', 'assetService'];

    function accountService($http, appConfig, utilities, assetService) {

        return {
            getRichList: function(callback) {
                $http.get(appConfig.urls.python_backend + "/accounts").then(function(response) {
                    var richs = [];
                    for(var i = 0; i < response.data.length; i++) {
                        var amount = utilities.formatBalance(response.data[i].amount, 5);
                        var account = {
                            name: response.data[i].name,
                            id: response.data[i].account_id,
                            amount: amount
                        };
                        richs.push(account);
                    }
                    callback(richs);
                });
            },
            // Todo: Cache
            checkIfWorker: function(account_id, callback) {
                var results = [];
                var is_worker = false;
                var worker_votes = 0;
                $http.get(appConfig.urls.python_backend + "/get_workers").then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        var worker_account = response.data[i][0].worker_account;
                        if (worker_account === account_id) {
                            is_worker = true;
                            worker_votes = utilities.formatBalance(response.data[i][0].total_votes_for, 5);
                            results[0] = is_worker;
                            results[1] = worker_votes;
                            callback(results);
                            break;
                        }
                    }
                });
            },
            checkIfWitness: function(account_id, callback) {
                var results = [];
                var is_witness = false;
                var witness_votes = 0;
                $http.get(appConfig.urls.python_backend + "/get_witnesses").then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        var witness_account = response.data[i][0].witness_account;
                        if (witness_account === account_id) {
                            is_witness = true;
                            witness_votes = utilities.formatBalance(response.data[i][0].total_votes, 5);
                            results[0] = is_witness;
                            results[1] = witness_votes;
                            results[2] = witness_account;
                            results[3] = response.data[i][0].witness_account_name;
                            results[4] = response.data[i][0].id;
                            results[5] = response.data[i][0].url;
                            callback(results);
                            break;
                        }
                    }
                });
            },
            checkIfCommittee: function(account_id, callback) {
                var results = [];
                var is_committee_member = false;
                var committee_votes = 0;
                $http.get(appConfig.urls.python_backend + "/get_committee_members").then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        var committee_member_account = response.data[i][0].committee_member_account;
                        if (committee_member_account === account_id) {
                            is_committee_member = true;
                            committee_votes = utilities.formatBalance(response.data[i][0].total_votes, 5);
                            results[0] = is_committee_member;
                            results[1] = committee_votes;
                            results[2] = committee_member_account;
                            results[3] = response.data[i][0].committee_member_account_name;
                            results[4] = response.data[i][0].id;
                            results[5] = response.data[i][0].url;

                            callback(results);
                            break;
                        }
                    }
                });
            },
            checkIfProxy: function(account_id, callback) {
                var results = [];
                var is_proxy = false;
                var proxy_votes = 0;
                $http.get(appConfig.urls.python_backend + "/top_proxies").then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        var proxy_account = response.data[i][0];
                        if (proxy_account === account_id) {
                            is_proxy = true;
                            proxy_votes = utilities.formatBalance(response.data[i][2], 5);
                            results[0] = is_proxy;
                            results[1] = proxy_votes;
                            callback(results);
                            break;
                        }
                    }
                });
            },
            getReferrers: function(account_id, page, callback) {
                var results = [];
                $http.get(appConfig.urls.python_backend + "/get_all_referrers?account_id=" + account_id + "&page=" + page)
                    .then(function (response) {

                    for (var i = 0; i < response.data.length; i++) {
                        var referrer = {
                            account_id: response.data[i][1],
                            account_name: response.data[i][2]
                        };
                        results.push(referrer);
                    }
                    callback(results);
                });
            },
            getReferrerCount: function(account, callback) {
                var count = 0;
                $http.get(appConfig.urls.python_backend + "/referrer_count?account_id=" + account).then(function (response) {
                    count = response.data[0];
                    callback(count);
                });
            },
            getFullAccount: function(account, callback) {
                var full_account = {};
                $http.get(appConfig.urls.python_backend + "/full_account?account_id=" + account).then(function (response) {
                    full_account  = response.data[0][1];
                    callback(full_account);
                });
            },
            getTotalAccountOps: function(account_id, callback) {
                $http.get(appConfig.urls.elasticsearch_wrapper + "/get_account_history?account_id="+account_id+"&from_date=2015-10-10&to_date=now&type=count")
                    .then(function(response) {
                        var count = 0;
                        angular.forEach(response.data, function (value, key) {
                            count = count + value.doc_count;
                        });
                    callback(count);
                });
            },
            getAccountName: function(account_id, callback) {
                var account_name = "";
                $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + account_id).then(function (response) {
                    account_name = response.data;
                    callback(account_name);
                });
            },
            parseAuth: function(auth, type, callback) {
                var results = [];
                angular.forEach(auth, function (value, key) {
                    var authline = {};
                    if(type === "key") {
                        authline = {
                            key: value[0],
                            threshold: value[1]
                        };
                        results.push(authline);
                    }
                    else if(type === "account") {
                        $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + value[0]).then(function (response) {
                            authline = {
                                account: value[0],
                                threshold: value[1],
                                account_name: response.data
                            };
                            results.push(authline);
                        });
                    }
                });
                callback(results);
            },
            parseBalance: function(limit_orders, call_orders, balance, precision, symbol, callback) {
                var limit_orders_counter = 0;
                angular.forEach(limit_orders, function (value, key) {
                    if (value.sell_price.quote.asset_id === balance.asset_type) {
                        limit_orders_counter++;
                    }
                });
                var call_orders_counter = 0;
                angular.forEach(call_orders, function (value, key) {
                    if (value.call_price.quote.asset_id === balance.asset_type) {
                        call_orders_counter++;
                    }
                });
                var balanceline = {
                    asset: balance.asset_type,
                    asset_name: symbol,
                    balance: parseFloat(utilities.formatBalance(balance.balance, precision)),
                    id: balance.id,
                    //owner: balance.owner,
                    call_orders_counter: parseInt(call_orders_counter),
                    limit_orders_counter: parseInt(limit_orders_counter)
                };
                callback(balanceline);
            },
            parseVotes: function(votes, callback) {
                var results = [];
                angular.forEach(votes, function (value, key) {
                    var type = "";
                    var account;
                    var votable_object_name = "";
                    var votes_for = 0;
                    if (value.id.substr(0, 4) === "1.6.") {
                        type = "Witness";
                        account = value.witness_account;
                        votes_for = value.total_votes;
                    }
                    else if (value.id.substr(0, 4) === "1.5.") {
                        type = "Committee Member";
                        account = value.committee_member_account;
                        votes_for = value.total_votes;
                    }
                    else if (value.id.substr(0, 4) === "1.14") {
                        type = "Worker";
                        account = value.worker_account;
                        votable_object_name = value.name;
                        votes_for = value.total_votes_for;
                    }
                    else {
                        type = "Other";
                        account = "No name";
                    }
                    $http.get(appConfig.urls.python_backend + "/account_name?account_id=" + account).then(function (response) {
                        var parsed = {
                            id: value.id,
                            type: type,
                            account: account,
                            account_name: response.data,
                            votable_object_name: votable_object_name,
                            votes_for: votes_for
                        };
                        results.push(parsed);
                    });
                });
                callback(results);
            },
            parseUIAs: function(assets, callback) {
                var results = [];
                angular.forEach(assets, function (value, key) {
                    //console.log(this);
                    assetService.getAssetNameAndPrecision(value, function (returnData) {
                        var uia = {
                            asset_id: value,
                            asset_name: returnData.symbol
                        };
                        results.push(uia);
                    });
                });
                callback(results);
            },

            parseProposals: function(proposals, callback) {
                var results = [];
                angular.forEach(proposals, function (value, key) {
                    var proposal = {
                        id: value
                    };
                    results.push(proposal);
                });
                callback(results);
            },
            parseVesting: function(vesting_balances, callback) {
                var results = [];
                if (vesting_balances.length > 0) {
                    angular.forEach(vesting_balances, function (value, key) {
                        assetService.getAssetNameAndPrecision(value.balance.asset_id, function (returnData) {
                            var vesting = {
                                id: value.id,
                                balance: utilities.formatBalance(value.balance.amount, returnData.precision),
                                asset_id: value.balance.asset_id,
                                asset_name: returnData.symbol
                            };
                            results.push(vesting);
                        });
                    });
                    callback(results);
                }
            },
            getAccountHistory: function(account_id, page, callback) {
                $http.get(appConfig.urls.python_backend + "/account_history_pager_elastic?account_id=" + account_id + "&page=" + page)
                    .then(function (response) {

                    var results = [];
                    var c = 0;
                    angular.forEach(response.data, function (value, key) {
                        var timestamp;
                        var witness;
                        var op = utilities.operationType(value.op_type);
                        var op_type = op[0];
                        var op_color = op[1];
                        var time = new Date(value.timestamp);
                        timestamp = time.toLocaleString();
                        witness = value.witness;
                        var operation = {
                            operation_id: value.id,
                            block_num: value.block_num,
                            time: timestamp,
                            witness: witness,
                            op_type: op_type,
                            op_color: op_color
                        };
                        var operation_text = "";
                        operation_text = utilities.opText(appConfig, $http, value.op_type,value.op, function(returnData) {
                            operation.operation_text = returnData;
                        });
                        results.push(operation);
                    });
                    callback(results);
                });
            }
        };
    }

})();

;
(function() {
    'use strict';

    angular.module('app').factory('governanceService', governanceService);
    governanceService.$inject = ['$http', 'appConfig', 'utilities', 'networkService'];

    function governanceService($http, appConfig, utilities, networkService) {

        return {
            getCommitteeMembers: function(callback) {
                var active_committee = [];
                var standby_committee = [];
                var committee = [];

                networkService.getHeader(function (returnData) {
                    var committee_count = returnData.committee_count;

                    $http.get(appConfig.urls.python_backend + "/get_committee_members").then(function(response) {
                        var counter = 1;
                        angular.forEach(response.data, function(value, key) {
                            var parsed = {
                                id: value[0].id,
                                total_votes: utilities.formatBalance(value[0].total_votes, 5),
                                url: value[0].url,
                                committee_member_account: value[0].committee_member_account,
                                committee_member_account_name: value[0].committee_member_account_name,
                                counter: counter
                            };

                            if(counter <= committee_count) {
                                active_committee.push(parsed);
                            }
                            else {
                                standby_committee.push(parsed);
                            }
                            counter++;
                        });
                    });
                    committee[0] = active_committee;
                    committee[1] = standby_committee;
                    callback(committee);
                });
            },
            getWitnesses: function(callback) {
                var active_witnesses = [];
                var standby_witnesses = [];
                var witnesses = [];

                networkService.getHeader(function (returnData) {
                    var witness_count = returnData.witness_count;

                    $http.get(appConfig.urls.python_backend + "/get_witnesses").then(function(response) {
                        var counter = 1;
                        angular.forEach(response.data, function(value, key) {
                            var parsed = {
                                id: value[0].id,
                                last_aslot: value[0].last_aslot,
                                last_confirmed_block_num: value[0].last_confirmed_block_num,
                                pay_vb: value[0].pay_vb,
                                total_missed: value[0].total_missed,
                                total_votes: utilities.formatBalance(value[0].total_votes, 5),
                                url: value[0].url,
                                witness_account: value[0].witness_account,
                                witness_account_name: value[0].witness_account_name,
                                counter: counter
                            };

                            if(counter <= witness_count) {
                                active_witnesses.push(parsed);
                            }
                            else {
                                standby_witnesses.push(parsed);
                            }
                            counter++;
                        });
                    });
                    witnesses[0] = active_witnesses;
                    witnesses[1] = standby_witnesses;
                    callback(witnesses);
                });
            },
            getWorkers: function(callback) {
                $http.get(appConfig.urls.python_backend + "/get_workers").then(function(response) {
                    var workers_current = [];
                    var workers_expired = [];
                    var workers = [];
                    for(var i = 0; i < response.data.length; i++) {
                        var now = new Date();
                        var start = new Date(response.data[i][0].work_begin_date);
                        var end = new Date(response.data[i][0].work_end_date);

                        var votes_for = utilities.formatBalance(response.data[i][0].total_votes_for, 5);
                        var daily_pay = utilities.formatBalance(response.data[i][0].daily_pay, 5);
                        var tclass = "";

                        var worker;

                        var have_url = 0;
                        if(response.data[i][0].url && response.data[i][0].url !== "http://") {
                            have_url = 1;
                        }

                        if(now > end) {
                            tclass = "danger";
                            worker = {
                                name: response.data[i][0].name,
                                daily_pay: daily_pay,
                                url: response.data[i][0].url,
                                have_url: have_url,
                                votes_for: votes_for,
                                votes_against: response.data[i][0].total_votes_against,
                                worker: response.data[i][0].worker_account,
                                start: start.toDateString(),
                                end: end.toDateString(),
                                id: response.data[i][0].id,
                                worker_name: response.data[i][0].worker_account_name,
                                tclass: tclass, perc: response.data[i][0].perc
                            };
                            workers_expired.push(worker);
                        }
                        else {
                            var voting_now = "";
                            if(now > start) {
                                if(response.data[i][0].perc >= 50 && response.data[i][0].perc < 100) {
                                    tclass = "warning";
                                }
                                else if(response.data[i][0].perc >= 100) {
                                    tclass = "success";
                                }
                            }
                            else {
                                tclass = "";
                                if(start > now) {
                                    voting_now = "VOTING NOW!";
                                }
                            }
                            worker = {
                                name: response.data[i][0].name,
                                daily_pay: daily_pay,
                                url: response.data[i][0].url,
                                have_url: have_url,
                                votes_for: votes_for,
                                votes_against: response.data[i][0].total_votes_against,
                                worker: response.data[i][0].worker_account,
                                start: start.toDateString(),
                                end: end.toDateString(),
                                id: response.data[i][0].id,
                                worker_name: response.data[i][0].worker_account_name,
                                tclass: tclass,
                                perc: response.data[i][0].perc,
                                voting_now: voting_now
                            };
                            workers_current.push(worker);
                        }
                    }
                    workers[0] = workers_current;
                    workers[1] = workers_expired;
                    callback(workers);
                });
            },
            getProxies: function(callback) {
                $http.get(appConfig.urls.python_backend + "/top_proxies").then(function(response) {
                    var proxies = [];
                    var counter = 1;
                    angular.forEach(response.data, function(value, key) {
                        var parsed = {
                            position: counter,
                            account: value[0],
                            account_name: value[1],
                            power: value[2],
                            followers: value[3],
                            perc: value[4]
                        };
                        if(counter <= 10) {
                            proxies.push(parsed);
                        }
                        counter++;
                    });
                    callback(proxies);
                });
            },
            getWitnessVotes: function(callback) {
                $http.get(appConfig.urls.python_backend + "/witnesses_votes").then(function(response2) {
                    var witnesses = [];
                    angular.forEach(response2.data, function (value, key) {
                        var parsed = {
                            id: value[1],
                            witness_account_name: value[0],
                            proxy1: value[2].split(":")[1],
                            proxy2: value[3].split(":")[1],
                            proxy3: value[4].split(":")[1],
                            proxy4: value[5].split(":")[1],
                            proxy5: value[6].split(":")[1],
                            proxy6: value[7].split(":")[1],
                            proxy7: value[8].split(":")[1],
                            proxy8: value[9].split(":")[1],
                            proxy9: value[10].split(":")[1],
                            proxy10: value[11].split(":")[1],
                            tclass1: ((value[2].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass2: ((value[3].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass3: ((value[4].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass4: ((value[5].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass5: ((value[6].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass6: ((value[7].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass7: ((value[8].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass8: ((value[9].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass9: ((value[10].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass10: ((value[11].split(":")[1] === "Y") ? "success" : "danger")
                        };
                        witnesses.push(parsed);
                    });
                    callback(witnesses);
                });
            },
            getWorkersVotes: function(callback) {
                $http.get(appConfig.urls.python_backend + "/workers_votes").then(function(response2) {
                    var workers = [];
                    angular.forEach(response2.data, function (value, key) {
                        var parsed = {
                            id: value[1],
                            worker_account_name: value[0],
                            worker_name: value[2],
                            proxy1: value[3].split(":")[1],
                            proxy2: value[4].split(":")[1],
                            proxy3: value[5].split(":")[1],
                            proxy4: value[6].split(":")[1],
                            proxy5: value[7].split(":")[1],
                            proxy6: value[8].split(":")[1],
                            proxy7: value[9].split(":")[1],
                            proxy8: value[10].split(":")[1],
                            proxy9: value[11].split(":")[1],
                            proxy10: value[12].split(":")[1],
                            tclass1: ((value[3].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass2: ((value[4].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass3: ((value[5].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass4: ((value[6].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass5: ((value[7].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass6: ((value[8].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass7: ((value[9].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass8: ((value[10].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass9: ((value[11].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass10: ((value[12].split(":")[1] === "Y") ? "success" : "danger")
                        };
                        workers.push(parsed);
                    });
                    callback(workers);
                });
            },
            getCommitteeVotes: function(callback) {
                $http.get(appConfig.urls.python_backend + "/committee_votes").then(function(response) {
                    var committee = [];
                    angular.forEach(response.data, function (value, key) {
                        var parsed = {
                            id: value[1],
                            committee_account_name: value[0],
                            proxy1: value[1].split(":")[1],
                            proxy2: value[2].split(":")[1],
                            proxy3: value[3].split(":")[1],
                            proxy4: value[4].split(":")[1],
                            proxy5: value[5].split(":")[1],
                            proxy6: value[6].split(":")[1],
                            proxy7: value[7].split(":")[1],
                            proxy8: value[8].split(":")[1],
                            proxy9: value[9].split(":")[1],
                            proxy10: value[10].split(":")[1],
                            tclass1: ((value[1].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass2: ((value[2].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass3: ((value[3].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass4: ((value[4].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass5: ((value[5].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass6: ((value[6].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass7: ((value[7].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass8: ((value[8].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass9: ((value[9].split(":")[1] === "Y") ? "success" : "danger"),
                            tclass10: ((value[10].split(":")[1] === "Y") ? "success" : "danger")
                        };
                        committee.push(parsed);
                    });
                    callback(committee);
                });
            }
        };
    }

})();

;
(function () {
    'use strict';

    angular.module('app')
        .controller('AppCtrl', [ '$scope', '$rootScope', '$route', '$document', 'appConfig', AppCtrl]); // overall control

    function AppCtrl($scope, $rootScope, $route, $document, appConfig) {

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;
        $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            //$document.scrollTo(0, 0);
        });
    }

})(); 
;
(function () {
    'use strict';

    angular.module('app')
        .config(['$routeProvider', function($routeProvider) {
            var routes, setRoutes;

            routes = [
                'dashboard',
				'assets', 'fees', 'witness', 'votes', 'workers', 'charts', 'search',
                'txs',
				'accounts',
                'markets'

            ]

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
                    templateUrl: '' + route + '.html'
                };
                $routeProvider.when(url, config);
                return $routeProvider;
            };

            routes.forEach(function(route) {
                return setRoutes(route);
            });

            $routeProvider
                .when('/', {redirectTo: '/dashboard'})
                .when('/dashboard', {templateUrl: 'sections/dashboard/dashboard.html'})

                .when('/assets', {templateUrl: 'sections/assets/assets.html'})
                .when('/assets/:name', {templateUrl: 'sections/assets/asset.html'})

                .when('/blocks', {templateUrl: 'sections/blocks/blocks.html'})
                .when('/blocks/:name', {templateUrl: 'sections/blocks/block.html'})

                .when('/objects/:name', {templateUrl: 'sections/objects/object.html'})

                .when('/operations/:name', {templateUrl: 'sections/operations/operations.html'})
                .when('/404', {templateUrl: 'sections/pages/404.html'})

				.when('/accounts', {templateUrl: 'sections/accounts/accounts.html'})
				.when('/accounts/:name', {templateUrl: 'sections/accounts/account.html'})

				.when('/fees', {templateUrl: 'sections/fees/fees.html'})
				.when('/witness', {templateUrl: 'sections/witnesses/witnesses.html'})
				.when('/workers', {templateUrl: 'sections/workers/workers.html'})
				.when('/votes', {templateUrl: 'sections/voting/voting.html'})
                .when('/committee_members', {templateUrl: 'sections/committee_members/committee_members.html'})
                .when('/proxies', {templateUrl: 'sections/proxies/proxies.html'})

                .when('/search', {templateUrl: 'sections/search/search.html'})

                .when('/markets', {templateUrl: 'sections/markets/markets.html'})
                .when('/markets/:name/:name2', {templateUrl: 'sections/markets/market.html'})

                .when('/txs', {templateUrl: 'sections/txs/txs.html'})
                .when('/txs/:name', {templateUrl: 'sections/txs/tx.html'})

                .otherwise({ redirectTo: '/404'});

        }]
    );

})();

;
(function () {

    angular.module('app.i18n', ['pascalprecht.translate'])
        .config(['$translateProvider', i18nConfig])
        .controller('LangCtrl', ['$scope', '$translate', LangCtrl]);

        // English, Español, 日本語, 中文, Deutsch, français, Italiano, Portugal, Русский язык, 한국어
        // Note: Used on Header, Sidebar, Footer, Dashboard
        // English:          EN-US
        // Spanish:          Español ES-ES
        // Chinese:          简体中文 ZH-CN
        // Chinese:          繁体中文 ZH-TW
        // French:           français FR-FR

        // Not used:
        // Portugal:         Portugal PT-BR
        // Russian:          Русский язык RU-RU
        // German:           Deutsch DE-DE
        // Japanese:         日本語 JA-JP
        // Italian:          Italiano IT-IT
        // Korean:           한국어 KO-KR


        function i18nConfig($translateProvider) {

            $translateProvider.useStaticFilesLoader({
                prefix: 'i18n/',
                suffix: '.json'
            });

            $translateProvider.preferredLanguage('en');
            $translateProvider.useSanitizeValueStrategy(null);
        }


        function LangCtrl($scope, $translate) {
            $scope.lang = 'English';

            $scope.setLang = function(lang) {
                switch (lang) {
                    case 'English':
                        $translate.use('en');
                        break;
                    case 'Español':
                        $translate.use('es');
                        break;
                    case '中文':
                        $translate.use('zh');
                        break;
                    case '日本語':
                        $translate.use('ja');
                        break;
                    case 'Portugues':
                        $translate.use('pt');
                        break;
                    case 'Русский язык':
                        $translate.use('ru');
                        break;
                }
                return $scope.lang = lang;
            };

            $scope.getFlag = function() {
                var lang;
                lang = $scope.lang;
                switch (lang) {
                    case 'English':
                        return 'flags-american';
                        break;
                    case 'Español':
                        return 'flags-spain';
                        break;
                    case '中文':
                        return 'flags-china';
                        break;
                    case 'Portugues':
                        return 'flags-portugal';
                        break;
                    case '日本語':
                        return 'flags-japan';
                        break;
                    case 'Русский язык':
                        return 'flags-russia';
                        break;
                }
            };

        }

})(); 

;
(function () {
    'use strict';

    angular.module('app').controller('DashboardCtrl', ['$scope', '$timeout', '$window', 'networkService', 'chartService',  DashboardCtrl])

        .filter('to_trusted', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }]);

    function DashboardCtrl($scope, $timeout, $window, networkService, chartService) {

        networkService.getHeader(function (returnData) {
            $scope.dynamic = returnData;
        });
        
        $scope.select = function(page_operations) {
            var page = page_operations -1;
            var limit = 20;
            var from = page * limit;

            networkService.getLastOperations(limit, from, function (returnData) {
                $scope.operations = returnData;
                $scope.currentPage = page_operations;
                $scope.total_ops = 10000;
            });
        };
        $scope.select(1);

		chartService.topOperationsChart(function (returnData) {
            $scope.operations_chart = returnData;
        });

        chartService.topProxiesChart(function (returnData) {
            $scope.proxies = returnData;
        });

        chartService.topMarketsChart(function (returnData) {
            $scope.markets = returnData;
        });

        chartService.topSmartCoinsChart(function (returnData) {
            $scope.smartcoins = returnData;
        });

        chartService.topUIAsChart(function (returnData) {
            $scope.uias = returnData;
        });

        chartService.topHoldersChart(function (returnData) {
            $scope.holders = returnData;
        });

        // Todo: subscribe to updates

        // hack for the display chart problem
        $scope.showChart = function(chartToShow) {

            $timeout(function() {
                $window.dispatchEvent(new Event("resize"));
            }, 1000);

            if(chartToShow === 0) {
                $timeout(function() {
                    $window.dispatchEvent(new Event("resize"));
                }, 100);
            }
            else if(chartToShow === 1) {
                $timeout(function() {
                    $window.dispatchEvent(new Event("resize"));
                }, 100);
            }
            else if(chartToShow === 2) {
                $timeout(function() {
                    $window.dispatchEvent(new Event("resize"));
                }, 100);
            }
            else if(chartToShow === 3) {
                $timeout(function() {
                    $window.dispatchEvent(new Event("resize"));
                }, 100);
            }
            else if(chartToShow === 4) {
                $timeout(function() {
                    $window.dispatchEvent(new Event("resize"));
                }, 100);
            }
            else if(chartToShow === 5) {
                $timeout(function() {
                    $window.dispatchEvent(new Event("resize"));
                }, 100);
            }
        };
    }
})();

;
(function () {
    'use strict';

    angular.module('app.header')
        .controller('headerCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', headerCtrl]);

    function headerCtrl($scope, $filter, $routeParams, $location, $http) {
        
    }

})();

;
(function () {
    'use strict';

    angular.module('app.nav')
        .directive('toggleNavCollapsedMin', ['$rootScope', toggleNavCollapsedMin])
        .directive('collapseNav', collapseNav)
        .directive('highlightActive', highlightActive)
        .directive('toggleOffCanvas', toggleOffCanvas);

    // swtich for mini style NAV, realted to 'collapseNav' directive
    function toggleNavCollapsedMin($rootScope) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var app;

            app = $('#app');

            ele.on('click', function(e) {
                if (app.hasClass('nav-collapsed-min')) {
                    app.removeClass('nav-collapsed-min');
                } else {
                    app.addClass('nav-collapsed-min');
                    $rootScope.$broadcast('nav:reset');
                }
                return e.preventDefault();
            });            
        }
    }

    // for accordion/collapse style NAV
    function collapseNav() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            var $a, $aRest, $app, $lists, $listsRest, $nav, $window, Timer, prevWidth, slideTime, updateClass;

            slideTime = 250;

            $window = $(window);

            $lists = ele.find('ul').parent('li');

            $lists.append('<i class="ti-angle-down icon-has-ul-h"></i><i class="ti-angle-right icon-has-ul"></i>');

            $a = $lists.children('a');

            $listsRest = ele.children('li').not($lists);

            $aRest = $listsRest.children('a');

            $app = $('#app');

            $nav = $('#nav-container');

            $a.on('click', function(event) {
                var $parent, $this;
                if ($app.hasClass('nav-collapsed-min') || ($nav.hasClass('nav-horizontal') && $window.width() >= 768)) {
                    return false;
                }
                $this = $(this);
                $parent = $this.parent('li');
                $lists.not($parent).removeClass('open').find('ul').slideUp(slideTime);
                $parent.toggleClass('open').find('ul').stop().slideToggle(slideTime);
                event.preventDefault();
            });

            $aRest.on('click', function(event) {
                $lists.removeClass('open').find('ul').slideUp(slideTime);
            });

            scope.$on('nav:reset', function(event) {
                $lists.removeClass('open').find('ul').slideUp(slideTime);
            });

            Timer = void 0;

            prevWidth = $window.width();

            updateClass = function() {
                var currentWidth;
                currentWidth = $window.width();
                if (currentWidth < 768) {
                    $app.removeClass('nav-collapsed-min');
                }
                if (prevWidth < 768 && currentWidth >= 768 && $nav.hasClass('nav-horizontal')) {
                    $lists.removeClass('open').find('ul').slideUp(slideTime);
                }
                prevWidth = currentWidth;
            };

            $window.resize(function() {
                var t;
                clearTimeout(t);
                t = setTimeout(updateClass, 300);
            });
          
        }
    }

    // Add 'active' class to li based on url, muli-level supported, jquery free
    function highlightActive() {
        var directive = {
            restrict: 'A',
            controller: [ '$scope', '$element', '$attrs', '$location', toggleNavCollapsedMinCtrl]
        };

        return directive;

        function toggleNavCollapsedMinCtrl($scope, $element, $attrs, $location) {
            var highlightActive, links, path;

            links = $element.find('a');

            path = function() {
                return $location.path();
            };

            highlightActive = function(links, path) {
                path = '#' + path;
                return angular.forEach(links, function(link) {
                    var $li, $link, href;
                    $link = angular.element(link);
                    $li = $link.parent('li');
                    href = $link.attr('href');
                    if ($li.hasClass('active')) {
                        $li.removeClass('active');
                    }
                    if (path.indexOf(href) === 0) {
                        return $li.addClass('active');
                    }
                });
            };

            highlightActive(links, $location.path());

            $scope.$watch(path, function(newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                return highlightActive(links, $location.path());
            });

        }

    }

    // toggle on-canvas for small screen, with CSS
    function toggleOffCanvas() {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link(scope, ele, attrs) {
            ele.on('click', function() {
                return $('#app').toggleClass('on-canvas');
            });         
        }
    }


})(); 




;
(function () {
    'use strict';

    angular.module('app.accounts')
        .controller('accountsCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$websocket', 'appConfig', 'utilities', 'accountService', 'assetService', accountsCtrl]);

    function accountsCtrl($scope, $filter, $routeParams, $location, $http, $websocket, appConfig, utilities, accountService, assetService) {

		var path = $location.path();
		var name = $routeParams.name;
		if(name) {
            name = name.toLowerCase();
			if(path.includes("accounts")) {

                accountService.getFullAccount(name, function (fullAccount) {

                    var cashback_balance_id = "";
                    var cashback_balance_balance = 0;
                    if(fullAccount.cashback_balance !== undefined && Object.keys(fullAccount.cashback_balance).length > 0) {
                        cashback_balance_id = fullAccount.cashback_balance.id;
                        cashback_balance_balance = fullAccount.cashback_balance.balance.amount;
                    }

                    var lifetime = "free member";
                    if (fullAccount.account.id === fullAccount.account.lifetime_referrer) {
                        lifetime = "lifetime member";
                    }

                    var vesting_balances = [];
                    accountService.parseVesting(fullAccount.vesting_balances, function (returnData) {
                        vesting_balances = returnData;
                    });

                    // TODO: get margin positions, call already in the api.py

                    var lifetime_fees_paid = fullAccount.statistics.lifetime_fees_paid;
                    var bts_balance = fullAccount.balances[0].balance;

                    jdenticon.update("#identicon", sha256(fullAccount.account.name));

                    // get total ops from ES
                    accountService.getTotalAccountOps(fullAccount.account.id, function (returnDataTotalOps) {
                        var total_ops = returnDataTotalOps;

                        accountService.getAccountName(fullAccount.account.options.voting_account, function (returnData) {

                            $scope.account = {
                                name: fullAccount.account.name,
                                id: fullAccount.account.id,
                                referer: fullAccount.referrer_name,
                                registrar: fullAccount.registrar_name,
                                statistics: fullAccount.account.statistics,
                                cashback: cashback_balance_id,
                                cashback_balance: utilities.formatBalance(cashback_balance_balance, 5),
                                lifetime: lifetime,
                                total_ops: total_ops,
                                lifetime_fees_paid: parseInt(utilities.formatBalance(lifetime_fees_paid, 5)),
                                bts_balance: parseInt(utilities.formatBalance(bts_balance, 5)),
                                vesting: vesting_balances,
                                memo_key: fullAccount.account.options.memo_key,
                                voting_account_id: fullAccount.account.options.voting_account,
                                voting_account_name: returnData
                            };
                        });
                    });

                    $scope.select_balances = function(page_balances) {
                        var page = page_balances -1;
                        var balances = [];
                        var total_counter = 0;
                        var limit_counter = 0;
                        var limit = 10;
                        var start = page * limit;
                        angular.forEach(fullAccount.balances, function (value, key) {

                            if(total_counter >= start && limit_counter <= limit) {
                                //if (value.balance === 0) { return; }
                                //console.log(value);
                                assetService.getAssetNameAndPrecision(value.asset_type, function (returnData) {
                                    accountService.parseBalance(fullAccount.limit_orders,
                                        fullAccount.call_orders,
                                        value,
                                        returnData.precision,
                                        returnData.symbol, function (returnData2) {
                                            balances.push(returnData2);

                                        });
                                });
                                ++limit_counter;
                            }
                            ++total_counter;
                        });
                        $scope.balances = balances;
                        $scope.currentPageBalance = page_balances;
                        $scope.balance_count = total_counter;

                    };
                    $scope.select_balances(1);

                    accountService.parseUIAs(fullAccount.assets, function (returnData) {
                        $scope.user_issued_assets = returnData;
                    });

                    accountService.parseAuth(fullAccount.account.owner.key_auths, "key", function (returnData) {
                        $scope.owner_keys = returnData;
                    });

                    accountService.parseAuth(fullAccount.account.owner.account_auths, "account", function (returnData) {
                        $scope.owner_accounts = returnData;
                    });

                    accountService.parseAuth(fullAccount.account.active.key_auths, "key", function (returnData) {
                        $scope.active_keys = returnData;
                    });

                    accountService.parseAuth(fullAccount.account.active.account_auths, "account", function (returnData) {
                        $scope.active_accounts = returnData;
                    });

                    var account_id = fullAccount.account.id;
                    accountService.checkIfWorker(account_id, function (returnData) {
                        $scope.is_worker = returnData[0];
                        $scope.worker_votes = returnData[1];
                    });
                    accountService.checkIfWitness(account_id, function (returnData) {
                        $scope.is_witness = returnData[0];
                        $scope.witness_votes = returnData[1];
                        $scope.witness_account = returnData[2];
                        $scope.witness_account_name = returnData[3];
                        $scope.witness_id = returnData[4];
                        $scope.witness_url = returnData[5];
                    });
                    accountService.checkIfCommittee(account_id, function (returnData) {
                        $scope.is_committee_member = returnData[0];
                        $scope.committee_votes = returnData[1];
                        $scope.committee_member_account = returnData[2];
                        $scope.committee_member_account_name = returnData[3];
                        $scope.committee_id = returnData[4];
                        $scope.committee_url = returnData[5];
                    });
                    accountService.checkIfProxy(account_id, function (returnData) {
                        $scope.is_proxy = returnData[0];
                        $scope.proxy_votes = returnData[1];
                    });

                    accountService.parseProposals(fullAccount.proposals, function (returnData) {
                        $scope.proposals = returnData;
                    });

                    accountService.parseVotes(fullAccount.votes, function (returnData) {
                        $scope.votes = returnData;
                    });

                    accountService.getReferrerCount(name, function (returnData) {
                        $scope.referral_count = returnData;
                    });

                    $scope.select_referers = function(page_referers) {
                        var page = page_referers -1;

                        accountService.getReferrers(name, page, function (returnData) {
                            $scope.referrers = returnData;
                            $scope.currentPageReferer = page_referers;
                        });
                    };
                    $scope.select_referers(1);


                    $scope.select = function(page_operations) {
                        var page = page_operations -1;

                        accountService.getAccountHistory(name, page, function (returnData) {
                            $scope.operations = returnData;
                            $scope.currentPage = page_operations;
                        });
                    };
                    $scope.select(1);


                    utilities.columnsort($scope, "balance", "sortColumn", "sortClass", "reverse", "reverseclass", "column");

                });
            }
		}
		else {
            if(path === "/accounts") {

                accountService.getRichList(function (returnData) {
                    $scope.richs = returnData;
                });

                utilities.columnsort($scope, "amount", "sortColumn", "sortClass", "reverse", "reverseclass", "column");
			}
		}
    }

})();

;
(function () {
    'use strict';

    angular.module('app.assets')
        .controller('assetsCtrl', ['$scope', '$routeParams', '$location', 'utilities', 'assetService', 'chartService', 'marketService', assetsCtrl]);

    function assetsCtrl($scope, $routeParams, $location, utilities, assetService, chartService, marketService) {

		var path = $location.path();
		var name = $routeParams.name;
		if(name) {
		    name = name.toUpperCase();
            if(path.includes("assets")) {

                assetService.getAssetFull(name, function (returnData) {
                    $scope.data = returnData;
                    assetService.getAssetHoldersCount(name, function (returnDataHolders) {
                        $scope.data.holders = returnDataHolders;
                    });
                    var precision = returnData.precision;
                    assetService.getAssetHolders(name, precision, function (returnDataHolders) {
                        $scope.accounts = returnDataHolders;
                    });
                });
                marketService.getAssetMarkets(name, function (returnData) {
                    $scope.markets = returnData;
                });
            }
            utilities.columnsort($scope, "volume", "sortColumn", "sortClass", "reverse", "reverseclass", "column");
            utilities.columnsort($scope, "amount", "sortColumn2", "sortClass2", "reverse2", "reverseclass2", "column");
		}
		else {
            if(path === "/assets") {

                assetService.getDexVolume(function (returnData) {
                    $scope.dynamic = returnData;
                });

                chartService.dailyDEXChart(function (returnData) {
                    $scope.dex_volume_chart = returnData;
                });

                assetService.getActiveAssets(function (returnData) {
                    $scope.assets = returnData;
                });

                utilities.columnsort($scope, "volume", "sortColumn", "sortClass", "reverse", "reverseclass", "column");
            }
		}
    }

})();

;
(function () {
    'use strict';

    angular.module('app.markets')
        .controller('marketsCtrl', ['$scope', '$routeParams', '$location', 'utilities', 'marketService', 'chartService', marketsCtrl]);

    function marketsCtrl($scope, $routeParams, $location, utilities, marketService, chartService) {

        var path = $location.path();
        var name = $routeParams.name;

        if(name) {
            name = name.toUpperCase();
            if(path.includes("markets")) {
                var name2 = $routeParams.name2;
                name2 = name2.toUpperCase();

                [name,name2] = [name2,name];

                var base_precision;
                var quote_precision;
                marketService.getAssetPrecision(name, function (returnData) {
                    base_precision = returnData;

                    marketService.getAssetPrecision(name, function (returnData2) {
                        quote_precision = returnData2;

                        marketService.getTicker(name, name2, function (returnData3) {

                            $scope.ticker = returnData3;
                            $scope.ticker.base_precision = base_precision;
                        });

                        marketService.getOrderBook(name, name2, base_precision, quote_precision, function (returnData4) {
                            $scope.asks = returnData4[0];
                            $scope.bids = returnData4[1];
                        });

                        marketService.getGroupedOrderBook(name, name2, base_precision, quote_precision, function (returnData5) {
                            $scope.sell_grouped = returnData5;
                        });
                        marketService.getGroupedOrderBook(name2, name, quote_precision, base_precision, function (returnData6) {
                            $scope.buy_grouped = returnData6;
                        });
                    });
                });

                /*
                // Todo: need to subscribe for updates. probably in a subscribe service with other similars(dashboard, account).
                var dataStream = $websocket(appConfig.urls.websocket);
                dataStream.send('{"method": "call", "params": [0, "subscribe_to_market", [5, "' + base + '", "'+quote+'"]], "id": 7}');

                $scope.$on("$locationChangeStart", function(event) {
                    // when leaving page unsubscribe from market
                    dataStream.send('{"method": "call", "params": [0, "unsubscribe_from_market", ["' + base + '", "'+quote+'"]], "id": 8}');
                });

                dataStream.onMessage(function (message) {
                    var parsed;
                    try {
                        // none
                    }
                    catch (err) {
                    }
                });
                /// end subscription
                */

                chartService.TradingView(name, name2);

                utilities.columnsort($scope, "price1", "sortColumn", "sortClass", "reverse", "reverseclass", "columnToSort");
                utilities.columnsort($scope, "price2", "sortColumn2", "sortClass2", "reverse2", "reverseclass2", "columnToSort2");
                utilities.columnsort($scope, "min_price3", "sortColumn3", "sortClass3", "reverse3", "reverseclass3", "columnToSort3");
                utilities.columnsort($scope, "min_price4", "sortColumn4", "sortClass4", "reverse4", "reverseclass4", "columnToSort4");
            }
        }
        else {
            if(path === "/markets") {

                marketService.getActiveMarkets(function (returnData) {
                    $scope.markets = returnData;
                });

                utilities.columnsort($scope, "volume", "sortColumn", "sortClass", "reverse", "reverseclass", "column");
            }
        }
    }

})();

;
(function () {
    'use strict';

    angular.module('app.committee_members')
        .controller('committeeCtrl', ['$scope', 'utilities', 'governanceService', committeeCtrl]);

    function committeeCtrl($scope, utilities, governanceService) {

        governanceService.getCommitteeMembers(function (returnData) {
            $scope.active_committee = returnData[0];
            $scope.standby_committee = returnData[1];
        });

        utilities.columnsort($scope, "total_votes", "sortColumn", "sortClass", "reverse", "reverseclass", "column");
        utilities.columnsort($scope, "total_votes", "sortColumn2", "sortClass2", "reverse2", "reverseclass2", "column2");

    }
})();

;
(function () {
    'use strict';

    angular.module('app.fees')
        .controller('feesCtrl', ['$scope', 'utilities', 'networkService', feesCtrl]);

    function feesCtrl($scope, utilities, networkService) {

        networkService.getFees(function (returnData) {
            $scope.fees = returnData;
        });

        utilities.columnsort($scope, "identifier", "sortColumn", "sortClass", "reverse", "reverseclass", "column");

    }
})();

;
(function () {
    'use strict';

    angular.module('app.objects')
        .controller('objectsCtrl', ['$scope', '$routeParams','networkService', objectsCtrl]);

    function objectsCtrl($scope, $routeParams, networkService) {

        var name = $routeParams.name;

        networkService.getObject(name, function (returnData) {
            $scope.data = returnData;
        });
    }
})();

;
(function () {
    'use strict';

    angular.module('app.proxies')
        .controller('proxiesCtrl', ['$scope', '$filter', '$routeParams', '$http', 'appConfig', 'utilities', proxiesCtrl]);

    function proxiesCtrl($scope, $filter, $routeParams, $http, appConfig, utilities) {

        $http.get(appConfig.urls.python_backend + "/top_proxies")
            .then(function(response) {
                //console.log(response.data);
                var proxies = [];
                var counter = 1;
                angular.forEach(response.data, function(value, key) {
                    var parsed = { position: counter, account: value[0], account_name: value[1], power: utilities.formatBalance(value[2], 5), followers: value[3], perc: value[4]};
                    if(counter <= 10)
                        proxies.push(parsed);
                    counter++;
                });
                $scope.proxies = proxies;
            });

        // column to sort
        $scope.column = 'position';
        // sort ordering (Ascending or Descending). Set true for desending
        $scope.reverse = false;
        // called on header click
        $scope.sortColumn = function(col){
            $scope.column = col;
            if($scope.reverse){
                $scope.reverse = false;
                $scope.reverseclass = 'arrow-up';
            }else{
                $scope.reverse = true;
                $scope.reverseclass = 'arrow-down';
            }
        };
        // remove and change class
        $scope.sortClass = function(col) {
            if ($scope.column == col) {
                if ($scope.reverse) {
                    return 'arrow-down';
                } else {
                    return 'arrow-up';
                }
            } else {
                return '';
            }
        }

    }
    
})();

;
(function () {
    'use strict';

    angular.module('app.search')
        .controller('searchCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', 'appConfig', searchCtrl]);

    function searchCtrl($scope, $filter, $routeParams, $location, $http, appConfig) {

        $scope.add2block = function(block) {
            $scope.block = block;
        };
        $scope.add2account = function(account) {
            $scope.account = account;
        };
        $scope.add2asset = function(asset) {
            $scope.asset = asset;
        };
        $scope.add2object = function(object) {
            $scope.object = object;
        };
        $scope.add2tx = function(tx) {
            $scope.tx = tx;
        };

        $scope.submit = function() {
            //console.log($scope);
            if ($scope.block)
                $location.path('/blocks/' + $scope.block + '/');
            else if ($scope.account)
                $location.path('/accounts/' + $scope.account + '/');
            else if ($scope.object)
                $location.path('/objects/' + $scope.object + '/');
            else if ($scope.asset)
                $location.path('/assets/' + $scope.asset + '/');
            else if ($scope.tx)
                $location.path('/txs/' + $scope.tx + '/');
        };
        $scope.required = true;
        $scope.updateData = function(param) {
            if(param == "block") {
                var start_block = $scope.block;
                var block_data = [];
                var number = start_block;
                $http.get(appConfig.urls.python_backend + "/getlastblocknumber")
                    .then(function (response) {
                        //console.log(response.data);
                        while (number <= response.data) {
                            block_data.push(number);
                            number *= 10;
                            number++;
                            block_data.push(number);
                        }
                    });
                $scope.blocks = block_data;
            }
            else if(param == "asset") {
                var start = $scope.asset;
                var asset_data = [];
                $http.get(appConfig.urls.python_backend + "/lookup_assets?start=" + start.toUpperCase())
                    .then(function (response) {
                        for (var i = 0; i < response.data.length; i++) {
                            asset_data[i] = response.data[i][0];
                        }
                    });
                $scope.assets = asset_data;
            }
            else if(param == "account") {
                var start = $scope.account;
                var account_data = [];
                $http.get(appConfig.urls.python_backend + "/lookup_accounts?start=" + start)
                    .then(function (response) {
                        for (var i = 0; i < response.data.length; i++) {
                            account_data[i] = response.data[i][0];
                        }
                    });
                $scope.accounts = account_data;
            }
            else if(param == "tx") {
                /*
                var start = $scope.account;
                var account_data = [];
                $http.get(appConfig.urls.python_backend + "/lookup_accounts?start=" + start)
                    .then(function (response) {
                        for (var i = 0; i < response.data.length; i++) {
                            account_data[i] = response.data[i][0];
                        }
                    });
                $scope.accounts = account_data;
                */
            }
        }
    }

})();

;
(function () {
    'use strict';

    angular.module('app.txs')
        .controller('txsCtrl', ['$scope', '$routeParams', '$location', 'networkService', txsCtrl]);

    function txsCtrl($scope, $routeParams, $location, networkService) {

        var path = $location.path();
        var name = $routeParams.name;

        if(name) {
            if (path.includes("txs")) {

                networkService.getTransactionMetaData(name, function (returnData) {
                    $scope.data = returnData;
                });

                networkService.getTransactionOperations(name, function (returnData) {
                    $scope.operations = returnData;
                    $scope.count = returnData.length;
                });
            }
        }
        else {
            if (path === "/txs") {
                networkService.getBigTransactions(function (returnData) {
                    $scope.transactions = returnData;
                });
            }
        }
    }

})();

;
(function () {
    'use strict';

    angular.module('app.voting')
        .controller('votingCtrl', ['$scope', 'governanceService', votingCtrl]);

    function votingCtrl($scope, governanceService) {

        governanceService.getProxies(function (returnData) {
            $scope.proxies = returnData;
        });
        governanceService.getWitnessVotes(function (returnData) {
            $scope.witnesses = returnData;
        });
        governanceService.getWorkersVotes(function (returnData) {
            $scope.workers = returnData;
        });
        governanceService.getCommitteeVotes(function (returnData) {
            $scope.committee = returnData;
        });
    }

})();

;
(function () {
    'use strict';

    angular.module('app.witnesses')
        .controller('witnessesCtrl', ['$scope', 'utilities', 'governanceService', witnessesCtrl]);

    function witnessesCtrl($scope, utilities, governanceService) {
        
        governanceService.getWitnesses(function (returnData) {
            $scope.active_witnesses = returnData[0];
            $scope.standby_witnesses = returnData[1];
        });

        utilities.columnsort($scope, "total_votes", "sortColumn", "sortClass", "reverse", "reverseclass", "column");
        utilities.columnsort($scope, "total_votes", "sortColumn2", "sortClass2", "reverse2", "reverseclass2", "column2");
    }
    
})();

;
(function () {
    'use strict';

    angular.module('app.workers')
        .controller('workersCtrl', ['$scope', 'utilities', 'governanceService', workersCtrl]);

    function workersCtrl($scope, utilities, governanceService) {
        
        governanceService.getWorkers(function (returnData) {
            $scope.workers_current = returnData[0];
            $scope.workers_expired = returnData[1];
        });

        utilities.columnsort($scope, "votes_for", "sortColumn", "sortClass", "reverse", "reverseclass", "column");
        utilities.columnsort($scope, "votes_for", "sortColumn2", "sortClass2", "reverse2", "reverseclass2", "column2");
    }

})();

;
(function () {
    'use strict';

    angular.module('app.operations')
        .controller('operationsCtrl', ['$scope', '$routeParams', 'networkService', operationsCtrl]);

    function operationsCtrl($scope, $routeParams, networkService) {

        var name = $routeParams.name;
        networkService.getOperation(name, function (returnData) {
            $scope.data = returnData;
        });
    }
})();

;
(function () {
    'use strict';

    angular.module('app.blocks')
        .controller('blocksCtrl', ['$scope', '$filter', '$routeParams', '$location', 'utilities', 'networkService', blocksCtrl]);

    function blocksCtrl($scope, $filter, $routeParams, $location, utilities, networkService) {

        var path = $location.path();
        var name = $routeParams.name;
        if(name) {

            name = name.toUpperCase();
            if(path.includes("blocks")) {

                networkService.getBlock(name, function (returnData) {
                    $scope.data = returnData;
                });
            }
        }
        else
        {
            if (path === "/blocks") {

                networkService.getBigBlocks(function (returnData) {
                    $scope.blocks = returnData;
                });

                utilities.columnsort($scope, "operations", "sortColumn", "sortClass", "reverse", "reverseclass", "column");

            }
        }
    }
})();

;
(function () {
    'use strict';

    angular.module('app.chart')
        .controller('EChartsCtrl', ['$scope', '$timeout', EChartsCtrl])

    function EChartsCtrl($scope, $timeout) {


    }    
})(); 
