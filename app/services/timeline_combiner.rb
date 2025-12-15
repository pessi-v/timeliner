# frozen_string_literal: true

class TimelineCombiner
  attr_reader :timelines

  def initialize(timelines)
    @timelines = Array(timelines)
  end

  def combine
    {
      "events" => combined_events,
      "periods" => combined_periods,
      "connectors" => combined_connectors,
      "config" => merged_config
    }
  end

  def combined_name
    timelines.map(&:name).join(" + ")
  end

  def combined_description
    "Combined timeline from: #{timelines.map(&:name).join(', ')}"
  end

  private

  def combined_events
    timelines.flat_map do |timeline|
      timeline.events.map do |event|
        prefix_ids(event, timeline.id)
      end
    end
  end

  def combined_periods
    timelines.flat_map do |timeline|
      timeline.periods.map do |period|
        prefix_ids(period, timeline.id)
      end
    end
  end

  def combined_connectors
    timelines.flat_map do |timeline|
      timeline.connectors.map do |connector|
        prefix_connector_ids(connector, timeline.id)
      end
    end
  end

  def prefix_ids(item, timeline_id)
    item.merge("id" => "#{timeline_id}-#{item['id']}")
  end

  def prefix_connector_ids(connector, timeline_id)
    {
      "id" => "#{timeline_id}-#{connector['id']}",
      "fromId" => "#{timeline_id}-#{connector['fromId']}",
      "toId" => "#{timeline_id}-#{connector['toId']}",
      "type" => connector["type"]
    }.merge(connector.except("id", "fromId", "toId", "type"))
  end

  def merged_config
    # Use the first timeline's config, or merge configs if needed
    # This can be customized based on requirements
    timelines.first&.config || {}
  end
end
