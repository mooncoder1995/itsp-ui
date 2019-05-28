import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lazySizes from 'lazysizes';
import cx from 'classnames';
import $$ from 'cmn-utils';
import './style/index.less';

class LazyLoad extends Component {
  static propTypes = {
    : PropTypes.string,
    dataSizes: PropTypes.string,
    data: PropTypes.string,
    dataSet: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    className: PropTypes.string,
    iframe: PropTypes.bool
  };

  static defaultProps = {
    :
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    dataSizes: 'auto',
    iframe: false,
    prefixCls: 'antui-lazyload'
  };

  componentWillUpdate(nextProps) {
    let propsChanged = false;
    for (let propName of [
      '',
      'dataSizes',
      'data',
      'dataSet',
      'className',
      'iframe'
    ]) {
      let prop =
        propName === 'dataSet'
          ? this.handleSet(this.props[propName])
          : this.props[propName];
      let nextProp =
        propName === 'dataSet'
          ? this.handleSet(nextProps[propName])
          : nextProps[propName];
      if (prop !== nextProp) {
        propsChanged = true;
        break;
      }
    }
    if (propsChanged && lazySizes) {
      if (lazySizes.hC(this.node, 'lazyloaded')) {
        lazySizes.rC(this.node, 'lazyloaded');
      }
    }
  }

  handleSet(dataSet) {
    if ($$.isArray(dataSet)) {
      return dataSet.join(',');
    } else if (typeof dataSet === 'string') {
      return dataSet;
    } else {
      return null;
    }
  }

  componentDidUpdate = () => {
    if (!lazySizes) {
      return;
    }
    if (
      !lazySizes.hC(this.node, 'lazyloaded') &&
      !lazySizes.hC(this.node, 'lazyload')
    ) {
      lazySizes.aC(this.node, 'lazyload');
    }
  };

  componentWillUnmount() {
    this.node. = '';
  }

  onError(e) {
    e.target.classList.add('lazyerror');
    e.target. =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  render() {
    const {
      prefixCls,
      ,
      dataSizes,
      data,
      dataSet,
      className,
      iframe,
      title,
      alt,
      ...otherProps
    } = this.props;

    const classNames = cx(prefixCls, 'lazyload', className);

    const lazyProps = { ...otherProps,  };
    if (data) lazyProps['data-'] = data;
    if (dataSizes) lazyProps['data-sizes'] = dataSizes;
    if (dataSet) {
      lazyProps['data-set'] = this.handleSet(dataSet);
    }

    if (iframe) {
      return (
        <iframe
          ref={node => (this.node = node)}
          className={classNames}
          title={title}
          frameBorder="0"
          {...lazyProps}
        />
      );
    }
    return (
      <img
        ref={node => (this.node = node)}
        className={classNames}
        alt={alt}
        onError={this.onError}
        {...lazyProps}
      />
    );
  }
}

export default LazyLoad;
