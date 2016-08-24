///<reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/>
///<reference path="../../bower_components/DefinitelyTyped/underscore/underscore.d.ts"/>

module basecomponents {

    angular.module('website-components', [
        'ui.codemirror',
        'hc.marked'
    ])

        .filter('tribeHtml', ['$sce', function ($sce) {
            return function (input) {
                return $sce.trustAsHtml(input);
            }
        }])

        .filter('tribeHtmlText', [function () {
            return function (input) {
                var el = angular.element('<div></div>');
                el.append(input);
                return el.text();
            }
        }])

        .directive('tribeEditableButtonText', [function () {
            return {
                restrict: 'A',
                scope: {
                    value: '='
                },
                templateUrl: 'app/templates/component_editable_button_text.html'
            };
        }])

        .directive('tribeEditableMd', [function () {
            return {
                restrict: 'A',
                scope: {
                    content: '='
                },
                templateUrl: 'app/templates/component_editable_md.html',
                controller: ['$scope', '$timeout', '$element', function ($scope, $timeout, $element) {
                    $scope.editorHolder = {
                        editor: null
                    };
                    $scope.cmOption = {
                        lineNumbers: false,
                        viewportMargin: Infinity,
                        mode: 'markdown',
                        onLoad: function (editor) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.editorHolder.editor = editor;
                                });
                            });
                        }
                    };
                    $scope.$watch('content', function () {
                        $timeout(function () {
                            $scope.$apply(function () {
                                if (!$scope.content || $scope.content.trim() === '') {
                                    $scope.compiledContent = '';
                                } else {
                                    $scope.compiledContent = marked($scope.content);
                                }
                            });
                        });
                    });
                    $scope.codemirrorLoaded = function (_editor) {
                        _editor.on("blur", function () {
                            $element.removeClass('edit');
                        });
                    };
                }],
                link: function (scope, el, attr, controller) {
                    scope.$watch('editorHolder.editor', function () {
                        var editor = scope.$eval('editorHolder.editor');
                        if (editor) {
                            var activate = function () {
                                el.addClass('edit');
                                editor.refresh();
                                editor.focus();
                            };
                            el.on('click', activate);
                            el.find('> div').on('focus', activate);
                            editor.on('blur', function () {
                                el.removeClass('edit');
                            });
                        }
                    });

                }
            };
        }])

        .directive('tribeEditableBlock', [function () {
            return {
                restrict: 'A',
                scope: {
                    content: '='
                },
                templateUrl: 'app/templates/component_editable_block.html',
                controller: ['$scope', '$timeout', function ($scope, $timeout) {
                    $scope.editorHolder = {
                        editor: null
                    };
                    $scope.cmOption = {
                        lineNumbers: false,
                        viewportMargin: Infinity,
                        onLoad: function (editor) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.editorHolder.editor = editor;
                                });
                            });
                        }
                    };
                    $scope.$watch('editorHolder.editor', function () {
                        var editor = $scope.$eval('editorHolder.editor');
                        if (editor) {
                            editor.refresh();
                        }
                    });
                }]
            };
        }])

        .directive('tribeEditableNumber', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    value: '=',
                    adjust: '@?'
                },
                templateUrl: 'app/templates/component_editable_number.html',
                link: function (scope, el, attrs, controller) {
                    var activate = function () {
                        var span = el.find('span');
                        var width = span.width();
                        el.addClass('edit');
                        var input = el.find('input');
                        if (scope.adjust !== 'false') {
                            input.width(width);
                        }
                        input.focus();
                    };
                    el.on('click', activate);
                    el.find('input').on('blur', function () {
                        el.removeClass('edit');
                    });
                    el.find('> div').on('focus', activate);
                }
            };
        }])

        .directive('tribeEditableText', ['$timeout', '$interval', function ($timeout, $interval) {
            return {
                restrict: 'A',
                scope: {
                    value: '=',
                    adjust: '@?'
                },
                templateUrl: 'app/templates/component_editable_text.html',
                link: function (scope, el) {
                    $timeout(function () {
                        var activate = function () {
                            var span = el.find('span');
                            var width = span.width();
                            el.addClass('edit');
                            var input = el.find('input');
                            if (scope.adjust !== 'false') {
                                input.width(width);
                            }
                            input.focus();
                        };
                        el.on('click', activate);
                        el.find('input').on('blur', function () {
                            el.removeClass('edit');
                        });
                        el.find('> div').on('focus', activate);
                    });
                }
            };
        }])

        .directive('tribeEditableOption', ['$timeout', '$document', '$window', function ($timeout, $document, $window) {
            return {
                restrict: 'A',
                scope: {
                    value: '=',
                    options: '=',
                    emptyText: '@?'
                },
                templateUrl: 'app/templates/component_editable_option.html',
                controller: ['$scope', '$timeout', function ($scope, $timeout) {
                    if (!$scope.emptyText) {
                        $scope.emptyText = 'empty';
                    }
                    $scope.selectOption = function (opt) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.value = opt;
                            });
                        });
                    };
                    $scope.$watch('value', function () {
                        if (!$scope.value) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.valueText = '';
                                });
                            });
                        } else {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    for (let opt of $scope.options) {
                                        if (opt === $scope.value || opt.value === $scope.value) {
                                            $scope.valueText = opt.text ? opt.text : opt;
                                            return;
                                        }
                                    }
                                    $scope.valueText = '';
                                });
                            });
                        }
                    });
                }],
                link: function (scope, el, attrs, controller) {
                    $timeout(function () {
                        var optionsDiv = el.find('.options');
                        optionsDiv.detach();
                        var body = $document.find('body');
                        var clear = function () {
                            el.removeClass('visible');
                            optionsDiv.detach();
                        };
                        var elWin = $($document.find('div[data-app-endpoints-details] > div'));
                        el.on('click', function () {
                            if (el.hasClass('visible')) {
                                optionsDiv.detach();
                                el.removeClass('visible');
                                elWin.off('scroll', clear);
                            } else {
                                var pos = el.find('> div').offset();
                                optionsDiv.css({
                                    top: `${pos.top + el.find('> div').height()}px`,
                                    left: `${pos.left}px`
                                });
                                body.append(optionsDiv);
                                el.addClass('visible');
                                elWin.on('scroll', clear);
                            }
                        });
                        optionsDiv.on('click', function () {
                            optionsDiv.detach();
                            el.removeClass('visible');
                            elWin.off('scroll', clear);
                        });
                        scope.$on('$destroy', function () {
                            optionsDiv.remove();
                            elWin.off('scroll', clear);
                        });
                    });
                }
            };
        }])

        .directive('tribeSwitch', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    value: '=',
                    trueValue: '=?',
                    falseValue: '=?'
                },
                templateUrl: 'app/templates/component_switch.html',
                link: function (scope, el) {
                    scope.uniqueId = _.uniqueId('tribeSwitch-');
                    var updateValue = function () {
                        $timeout(function () {
                            scope.$apply(function () {
                                scope.value = !scope.value;
                            });
                        });
                    };
                    el.find('div[tabindex]').on('click', updateValue);
                    el.find('div[tabindex]').on('keypress', updateValue);
                },
                controller: ['$scope', function ($scope) {
                    if (_.isNull($scope.trueValue) || _.isUndefined($scope.trueValue)) {
                        $scope.trueValue = true;
                    }
                    if (_.isNull($scope.falseValue) || _.isUndefined($scope.falseValue)) {
                        $scope.falseValue = false;
                    }
                }]
            };
        }])

        .directive('tribeMultiselect', ['$window', '$timeout', function ($window, $timeout) {
            return {
                restrict: 'A',
                scope: {
                    availableOptions: '=?',
                    selectedOptions: '=',
                    update: '=?',
                    singleSelect: '=?'
                },
                templateUrl: 'app/templates/component_multiselect.html',
                controller: ['$scope', '$element', function ($scope, $element) {
                    if ($scope.availableOptions === undefined) {
                        $scope.availableOptions = [];
                    }
                    if ($scope.update === undefined) {
                        $scope.update = true;
                    }
                    if ($scope.singleSelect === undefined) {
                        $scope.singleSelect = false;
                    }
                    $scope.$watch('selectedOptions', function () {
                        if (!$scope.selectedOptions) {
                            return;
                        }
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.availableOptions = _.union($scope.availableOptions, $scope.selectedOptions);
                                var intersection = _.intersection($scope.selectedOptions, $scope.availableOptions);
                                _.each(intersection, function (value) {
                                    var index = $scope.availableOptions.indexOf(value);
                                    if (index > -1) {
                                        $scope.availableOptions.splice(index, 1);
                                    }
                                });
                            });
                        });
                    });
                    var adjustBox = function () {
                        $timeout(function () {
                            var parent = $element.find('> div > div.selected');
                            var child = $element.find('> div > div.selected > div:last-of-type > div');
                            parent.height(child.height() + 6);
                        });
                    };
                    this.adjustBox = adjustBox;
                    var unselectItem = function (item) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                var index = $scope.selectedOptions.indexOf(item);
                                if (index > -1) {
                                    $scope.selectedOptions.splice(index, 1);
                                }
                                $scope.availableOptions.push(item);
                                adjustBox();
                            });
                        });
                    };
                    $scope.unselectItem = unselectItem;
                    $scope.selectItem = function (item) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                if ($scope.singleSelect) {
                                    $scope.availableOptions = _.union($scope.availableOptions, $scope.selectedOptions, [item]);
                                    $scope.selectedOptions = [item];
                                } else {
                                    var index = $scope.availableOptions.indexOf(item);
                                    if (index > -1) {
                                        $scope.availableOptions.splice(index, 1);
                                    }
                                    $scope.selectedOptions.push(item);
                                    $scope.selectedOptions = _.uniq($scope.selectedOptions);
                                }
                                $scope.filterText = '';
                                $scope.deleteEngaged = false;
                                adjustBox();
                            });
                        });
                    };
                    var includeNewItem = function (item) {
                        $scope.selectItem(item);
                    };
                    $scope.filterText = '';
                    $scope.deleteEngaged = false;
                    $scope.keyDown = false;
                    $scope.textEntered = function (event) {
                        if ($scope.deleteEngaged
                            && event.keyCode === 8 /* back key */
                            && $scope.filterText === ''
                            && $scope.selectedOptions.length > 0
                        ) {
                            unselectItem($scope.selectedOptions[$scope.selectedOptions.length - 1]);
                        } else if ($scope.update && event.keyCode === 13) {
                            includeNewItem($scope.filterText);
                        }
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.deleteEngaged = $scope.filterText === '' && event.keyCode === 8;
                                $scope.keyDown = event.keyCode === 40;
                            });
                        });
                    };
                }],
                link: function (scope, el, attr, controller) {
                    el.find('div.selected > div:first-of-type').on('click', function () {
                        el.toggleClass('active');
                    });
                    el.find('input').on('focus', function () {
                        el.find('span.empty').css('display', 'none');
                        el.addClass('editing');
                    });
                    el.find('input').on('blur', function () {
                        if (!scope.selectedOptions || !scope.selectedOptions.length) {
                            el.find('span.empty').css('display', 'inline');
                        }
                        el.removeClass('editing');
                    });
                    el.on('click', function () {
                        el.find('div.selected input[type="text"]').focus();
                    });
                    var collapseOptionsListPromise = null;
                    el.find('div.selected input[type="text"]').on('blur', function () {
                        if (collapseOptionsListPromise) {
                            $timeout.cancel(collapseOptionsListPromise);
                        }
                        collapseOptionsListPromise = $timeout(function () {
                            el.removeClass('active');
                        }, 200);
                    }).on('focus', function () {
                        if (collapseOptionsListPromise) {
                            $timeout.cancel(collapseOptionsListPromise);
                        }
                    });
                    el.find('div.available div.opt').bind('click', function () {
                        controller.adjustBox();
                    });
                    scope.$watch('selectedOptions', function () {
                        if (scope.selectedOptions && scope.selectedOptions.length) {
                            el.find('span.empty').css('display', 'none');
                        }
                        controller.adjustBox();
                    });
                    scope.$watch('keyDown', function () {
                        if (scope.keyDown) {
                            el.toggleClass('active');
                        }
                    });
                    scope.$watch('filterText', function () {
                        if (scope.filterText === '') {
                            el.removeClass('active');
                        } else {
                            el.addClass('active');
                        }
                        var hiddenSpan = el.find('input ~ span').first();
                        el.find('input').css('width', (hiddenSpan.width() + 5) + 'px');
                        controller.adjustBox();
                    });
                    scope.$watch('deleteEngaged', function () {
                        if (scope.deleteEngaged) {
                            el.find('div.selected').addClass('delete');
                        } else {
                            el.find('div.selected').removeClass('delete');
                        }
                    });
                    var winEl = angular.element($window);
                    winEl.bind('resize', controller.adjustBox);
                    scope.$on('$destroy', function () {
                        winEl.unbind('resize', controller.adjustBox);
                    });
                }
            };
        }])

        .run(function ($rootScope) {
            // placeholder
        });
}
