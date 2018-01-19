import React from 'react';
import slugify from '~libs/slugify';
import HeadingHero from '~components/HeadingHero';
import VisibleChildWatcher from '~components/VisibleChildWatcher';
import ContentCard from '~components/ContentCard';
import ContentNavigation, {
  generateTitlesFromStream,
} from '~components/ContentNavigation';
import StreamField from "~components/content/StreamField";
import {Page} from "~components/content/types";
import {FalmerImage} from "../../../types/events";

interface IProps {
  page: Page<{ title: string, sidebarBody: any, body: any, headingImage: FalmerImage, contentsInSidebar: boolean }>
}

interface IState {
  visibleKey: null | string;
}

class SectionContentPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.handleVisibleChildChange = this.handleVisibleChildChange.bind(this);
    this.state = {
      visibleKey: null,
    };
  }

  handleVisibleChildChange(key: string) {
    this.setState({ visibleKey: key });
  }

  render() {
    const {
      page: {
        data: { title, sidebarBody, body, headingImage, contentsInSidebar }
      },
      page,
    } = this.props;
    return (
      <div className="Layout Layout--sidebar-left">
        <div>
          <aside>
            {contentsInSidebar ? (
              <ContentNavigation
                items={generateTitlesFromStream(body)}
                activeKey={this.state.visibleKey || undefined}
              />
            ) : null}
            <StreamField page={page} items={sidebarBody}/>
          </aside>
        </div>
        <div>
          <HeadingHero title={title} imageURL={headingImage.resource} />
          <VisibleChildWatcher onChange={this.handleVisibleChildChange}>
            {body.map((block: any) => ( // todo
              <ContentCard anchor={slugify(block.value.heading)}>
                <h2 className="Heading Heading--highlight">
                  {block.value.heading}
                </h2>
                {block.value.body.map((bodyItem: any) => ( // todo
                  <div
                    className="Prose"
                    dangerouslySetInnerHTML={{ __html: bodyItem.value }}
                  />
                ))}
              </ContentCard>
            ))}
          </VisibleChildWatcher>
        </div>
      </div>
    );
  }
}

export { SectionContentPage };
